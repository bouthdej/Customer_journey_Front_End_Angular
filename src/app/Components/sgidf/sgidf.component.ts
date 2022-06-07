import { Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs';

import 'leader-line';

import { SgidfService } from 'src/app/Services/sgidf.service';
import { HttpErrorResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NotificationService } from 'src/app/Services/notification.service';

declare let LeaderLine: any;

interface idaasForm {
  name: string;
  value: string;
}

@Component({
  selector: 'app-sgidf',
  templateUrl: './sgidf.component.html',
  styleUrls: ['./sgidf.component.scss']
})
export class SgidfComponent implements OnInit, OnDestroy {

  //declare subscriptions
  createIdentityElementSbs = new Subscription

  error: boolean = false
  errorMsg: string = ""
  dragPosition = { x: 0, y: 0 };
  line = []
  attachedNumber: number = 1
  sgidfForms: idaasForm[] = [
    { name: "get Identifier", value: "getIdentifierElement" },
    { name: "create Identifier", value: "createIdenifierElement" },
    { name: "get Identity", value: "getIdentityElement" },
    { name: "get contact identifier", value: "getContactIdentifierElement" },
    { name: "update identity password", value: "updateIdentityPwdElement" }
  ]
  elements = []
  selectedValue: string = ""
  show: boolean = false
  attachForms = []
  attachedForms = []
  attachVal: string = ""
  attachedVal: string = ""
  attachTrack = []

  detachState: boolean = false
  dettachedVal: string = ""
  dettachTracks = []
  identityBDay: any

  //Create identity variables:
  civilitys = [{
    name:"M.",
    id: "1"
  },
  {
    name:"Mme",
    id: "2"
  }
  ]
  genders = [
    {
      name: "male",
      id: "1"
    },
    {
      name: "female",
      id: "2"
    }
  ]

  identifierTypes = [
    {
      name: "LOGIN",
    },
    {
      name: "ISF",
    }
  ]

  contactIdentifierTypes = [
    {
      name: "email",
    },
    {
      name: "mobile",
    }
  ]

  action: string = ""


  contactIdentifiers: any[] = [];
  myContactIdentifier: [{}];


  @ViewChild("parent", { static: false }) parentDiv: ElementRef
  @ViewChild('createIdentityElement', { read: ElementRef, static: false }) createIdentityElement: ElementRef;
  @ViewChild('contactIdentifiersElement', { read: ElementRef, static: false }) contactIdentifiersElement: ElementRef;
  @ViewChild('createIdenifierElement', { read: ElementRef, static: false }) createIdenifierElement: ElementRef;
  @ViewChild('getIdentityElement', { read: ElementRef, static: false }) getIdentityElement: ElementRef;
  @ViewChild('getContactIdentifierElement', { read: ElementRef, static: false }) getContactIdentifierElement: ElementRef;
  @ViewChild('updateIdentityPwdElement', { read: ElementRef, static: false }) updateIdentityPwdElement: ElementRef;

  constructor(
    private renderer: Renderer2,
    private SGIDFSvc: SgidfService,
    private formBuilder: FormBuilder,
    private notification :NotificationService
  ) { }


  // Create user -Full identity- forms
  createFullIdentity = this.formBuilder.group({
     status: ['activated'],
      profile: this.formBuilder.group({
      civility: [],
      displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      avatar: ["1'avatar1", [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      gender: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      birthdate: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      timeZone: ['Europe/Paris'],
      language: ['fr']
    }),
 /*    identifiers: this.formBuilder.array([{
      // this.formBuilder.group({
      provider: '',
      type: '',
      value: ''
      // })
    }
      // "provider": "sandbox",
      // "type": "LOGIN",
      // "value": "bouthayna.djebali@sofrecom.com"
    ]), */
    password: this.formBuilder.group({
      value: ['', [Validators.required, Validators.minLength(3)]]
    }),

    contactIdentifiers: this.formBuilder.array([]),
    identifiers : this.formBuilder.array([])

    /*  contactIdentifiers: this.formBuilder.array([{
       value:'',
       isPassword:'',
       type:''
     } */

    /*     ]),
     */    // contactIdentifiers: this.formBuilder.group({
    //   value:[''],
    //   isPassword:[false],
    //   type:['',[]],
    // }),



  })

  get getConcatIdentifiers() {
    return this.createFullIdentity.controls["contactIdentifiers"] as FormArray;
  }


  get getIdentifiersForm() {
    return this.createFullIdentity.controls["identifiers"] as FormArray;
  }

  /*    contactIdentifiers:  this.formBuilder.array([{
         value:'omarthi@sofrecom.com',
         isPassword:false,
         type:'email',
       }])
   })
 
  */
  // Create user -Full identity- forms
  contactIdentifiersForms = this.formBuilder.group({
    value: ['', [Validators.required, Validators.email || Validators.minLength(8)]],
    isPassword: [false],
    type: ['', [Validators.minLength(5), Validators.maxLength(6), Validators.required]],
  })

  IdentifiersForms = this.formBuilder.group({
    type:  ['', [Validators.required, Validators.email || Validators.minLength(8)]],
    value:  ['', [Validators.required, Validators.email || Validators.minLength(8)]],
    provider: ['', [Validators.required, Validators.email || Validators.minLength(8)]],
  })


  

  // Create user -Full identity- forms
  getIdentifier = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  })
  updateIdentityPwd = this.formBuilder.group({
    password: this.formBuilder.group({
      value: ['', [Validators.required, Validators.minLength(8)]]
    }),


  })
  ngOnInit() {
    this.getConcatIdentifiers.push(this.contactIdentifiersForms);   
    this.getIdentifiersForm.push(this.IdentifiersForms)

  }

  addNewCompany() {
    let control = <FormArray>this.createFullIdentity.controls.identifiers;
    control.push(
      this.formBuilder.group({
        provider: [''],
        type: [''],
        value: ['']
      })
    )
  }

  createNewUser(form: FormGroup) {

    this.createIdentityElementSbs = this.SGIDFSvc.creatIdentity(form.value).subscribe(
      createIdentityRes => {
        this.notification.success("Identité crée avec succés")
      },
      (errorRes: HttpErrorResponse) => {
        console.log(errorRes)
        if (errorRes.status == 400) {
          this.error = true
          this.errorMsg = 'Error creating user'
        } else if (errorRes.status == 500) {
          this.error = true
          this.errorMsg = "server error, please try later"
        }
      }
    )
  }

  contactIdentifiersFn(form: FormGroup) {

    if (this.action !== "") {
      this.SGIDFSvc.updateContactIdentifiers({
        methode: this.action,
        body: form.value
      }).subscribe(contactIdentifiersFnRes => {
        console.log(contactIdentifiersFnRes)
        this.notification.success("ContactIdentifier  modifié avec succés!!!!")

      },
      error => {
        console.log(error);      
      }
      
      
      )
    } else {
      this.error = true
      this.errorMsg = "Please choose action"
    }
  }

  getIdentifierId(form: FormGroup) {
    this.SGIDFSvc.getIdentifier(form.value).subscribe(identifierRes => {
      console.log(identifierRes)
      this.notification.success("get user ID")

    },
      (errorRes: HttpErrorResponse) => {
        console.log(errorRes)
        if (errorRes.status == 400) {
          this.error = true
          this.errorMsg = 'Error identifier res'
        } else if (errorRes.status == 500) {
          this.error = true
          this.errorMsg = "server error, please try later"
        }
      })
  }
  updatepwdIdentityFn(form: FormGroup) {
    this.SGIDFSvc.updateidentitypwd(form.value).subscribe
  }

  setAction(type) {
    this.action = type
  }

  addNewElem() {
  
  }

  updateAttachVal(val) {
    this.attachVal = val
  }

  updateDettachedVal(val) {
    this.dettachedVal = val
  }

  updateAttachedVal(val) {
    this.attachedVal = val
  }

  nameChanged(event) {
    console.log(event)

  }

  updatePosition() {
    for (const track of this.attachTrack) {
      this.line[track.index].remove()
      this.line[track.index] = new LeaderLine(track.attach.nativeElement, track.attached.nativeElement, { color: 'black', size: 4, endLabel: `${track.link}` });
    }
  }

  attach() {
    // if(this.attachVal==null || this.attachVal==undefined || this.attachedVal==null || this.attachedVal==undefined){
    //   this.error=true
    //   this.errorMsg="Please choose form before click on attach button"
    // }else if(this.attachVal==this.attachedVal){
    //   this.error=true
    //   this.errorMsg="Forms must be different to be attached"
    // }else{
    //   this.error=false
    //   switch (`${this.attachVal}${this.attachedVal}`) {
    //     case "getIdentifierElementcreateIdenifierElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.getIdentifierElement.nativeElement, this.createIdenifierElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.getIdentifierElement,
    //         attached:this.createIdenifierElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;
    //     case "getIdentifierElementgetIdentityElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.getIdentifierElement.nativeElement, this.getIdentityElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.getIdentifierElement,
    //         attached:this.getIdentityElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;
    //     case "getIdentifierElementgetContactIdentifierElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.getIdentifierElement.nativeElement, this.getContactIdentifierElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.getIdentifierElement,
    //         attached:this.getContactIdentifierElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;
    //     case "getIdentifierElementupdateIdentityPwdElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.getIdentifierElement.nativeElement, this.updateIdentityPwdElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.getIdentifierElement,
    //         attached:this.updateIdentityPwdElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;

    //     case "createIdenifierElementgetIdentityElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.createIdenifierElement.nativeElement, this.getIdentityElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.createIdenifierElement,
    //         attached:this.getIdentityElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;
    //     case "createIdenifierElementgetContactIdentifierElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.createIdenifierElement.nativeElement, this.getContactIdentifierElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.createIdenifierElement,
    //         attached:this.getContactIdentifierElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;
    //     case "createIdenifierElementupdateIdentityPwdElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.createIdenifierElement.nativeElement, this.updateIdentityPwdElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.createIdenifierElement,
    //         attached:this.updateIdentityPwdElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;

    //     case "getIdentityElementgetContactIdentifierElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.getIdentityElement.nativeElement, this.getContactIdentifierElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.getIdentityElement,
    //         attached:this.getContactIdentifierElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;
    //     case "getIdentityElementupdateIdentityPwdElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.getIdentityElement.nativeElement, this.updateIdentityPwdElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.getIdentityElement,
    //         attached:this.updateIdentityPwdElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;
    //     case "getIdentityElementupdateIdentityPwdElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.getIdentityElement.nativeElement, this.updateIdentityPwdElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.getIdentityElement,
    //         attached:this.updateIdentityPwdElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;
    //     case "getContactIdentifierElementupdateIdentityPwdElement":
    //       this.line[this.attachedNumber]=new LeaderLine(this.getContactIdentifierElement.nativeElement, this.updateIdentityPwdElement.nativeElement, {color: 'black', size: 4, endLabel: `link${this.attachedNumber}`});
    //       this.attachTrack.push({
    //         index:this.attachedNumber,
    //         attach:this.getContactIdentifierElement,
    //         attached:this.updateIdentityPwdElement,
    //         link:`link ${this.attachedNumber}`
    //       })
    //       this.dettachTracks.push(`link ${this.attachedNumber}`)
    //       this.detachState=true
    //       this.attachedNumber++
    //     break;
    //   }
    // }
  }

  detach() {
    // if (this.dettachedVal!=null ||this.dettachedVal!=undefined ) {
    //   this.attachTrack=this.attachTrack.filter(elem=>elem.link!=this.dettachedVal)
    //   const index=this.dettachedVal.split(' ')[1]
    //   this.line[index].remove()
    //   this.dettachTracks=this.dettachTracks.filter(elem=>elem!=this.dettachedVal)
    //   if(this.attachTrack.length==0){
    //     this.detachState=false
    //   }
    // }
  }

  ngOnDestroy(): void {
    this.createIdentityElementSbs.unsubscribe()
    for (const track of this.attachTrack) {
      this.line[track.index].remove()
    }
  }

}
