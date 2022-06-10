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

  createIdentityElementSbs = new Subscription

  error: boolean = false
  errorMsg: string = ""
  dragPosition = { x: 0, y: 0 };
  line = []
  attachedNumber: number = 1
  sgidfForms: idaasForm[] = [
    { name: "create new Identity", value: "createIdentityElement" },
    { name: "contact identifier", value: "contactIdentifiersElement" },
    { name: "get Identitier ID", value: "getIdentifiers" },
  ]
  elements = []
  selectedValue: string = ""
  show: boolean = false
  attachForms = []
  allowedForms=[]
  transmittedInfos=[]
  transmittedInfo=""
  attachVal: string = ""
  attachedVal: string = ""
  attachTrack = []

  detachState: boolean = false
  dettachedVal: string = ""
  dettachTracks = []
  identityBDay: any
  result=[]

  //Create identity variables:
  civilities = [{
    name:"M.",
    val: "male",
    id: "1"
  },
  {
    name:"Mme",
    val: "male",
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

  showAttached:boolean=false
  createIdentityElementObj={
    name:"create identity",
    value:"createIdentityElement",
    links: "email"
  }

  @ViewChild("parent", { static: false }) parentDiv: ElementRef
  @ViewChild('createIdentityElement', { read: ElementRef, static: false }) createIdentityElement: ElementRef;
  @ViewChild('IdentifiersElem', { read: ElementRef, static: false }) IdentifiersElem: ElementRef;
  @ViewChild('contactIdentifiersElem', { read: ElementRef, static: false }) contactIdentifiersElem: ElementRef;
  @ViewChild('contactIdentifiersElement', { read: ElementRef, static: false }) contactIdentifiersElement: ElementRef;
  @ViewChild('getIdentifiersElement', { read: ElementRef, static: false }) getIdentifiersElement: ElementRef;

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
    password: this.formBuilder.group({
      value: ['', [Validators.required, Validators.minLength(3)]]
    }),
    contactIdentifiers: this.formBuilder.array([]),
    identifiers : this.formBuilder.array([])
  })

  contactIdentifiers= this.formBuilder.group({
    type: ['', [Validators.required, Validators.minLength(3)]],
    valye: ['', [Validators.required, Validators.minLength(3)]],
    provider: ['', [Validators.required, Validators.minLength(3)]]

  })

  identifiers= this.formBuilder.group({
    value: ['', [Validators.required, Validators.minLength(3)]],
    isPassword: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', [Validators.required, Validators.minLength(3)]]
  })

  get getConcatIdentifiers() {
    return this.createFullIdentity.controls["contactIdentifiers"] as FormArray;
  }


  get getIdentifiersForm() {
    return this.createFullIdentity.controls["identifiers"] as FormArray;
  }

  // Create user -Full identity- forms
  contactIdentifiersForms = this.formBuilder.group({
    value: ['email@orange.com', [Validators.required, Validators.email || Validators.minLength(8)]],
    isPassword: [false],
    type: ['email', [Validators.minLength(5), Validators.maxLength(6), Validators.required]],
  })

  // Create user -Full identity- forms
  modifiedContactIdentifier = this.formBuilder.group({
    value: ['email@orange.com', [Validators.required, Validators.email || Validators.minLength(8)]],
    isPassword: [false],
    type: ['email', [Validators.minLength(5), Validators.maxLength(6), Validators.required]],
  })

  IdentifiersForms = this.formBuilder.group({
    type:  ['LOGIN', [Validators.required, Validators.email || Validators.minLength(8)]],
    value:  ['email@orange.com', [Validators.required, Validators.email || Validators.minLength(8)]],
    provider: ['sandbox', [Validators.required, Validators.email || Validators.minLength(8)]],
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

  insertIdentityElement(){
    this.getIdentifiersForm.push(this.IdentifiersForms)
  }

  insertContactIdentityElement(){
    this.getConcatIdentifiers.push(this.contactIdentifiersForms);
  }

  createNewUser(form: FormGroup) {
    this.createIdentityElementSbs = this.SGIDFSvc.creatIdentity(form.value).subscribe(
      createIdentityRes => {
        this.notification.success("Identité crée avec succés")
        console.log(createIdentityRes)
        this.result.push(createIdentityRes["body"])
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
    switch (this.selectedValue) {
      case "createIdentityElement":
        this.renderer.setStyle(this.IdentifiersElem.nativeElement,"display", "block")
        this.renderer.setStyle(this.IdentifiersElem.nativeElement,"position", "relative")
        this.renderer.setStyle(this.contactIdentifiersElem.nativeElement,"display", "block")
        this.renderer.setStyle(this.contactIdentifiersElem.nativeElement,"position", "relative")
        this.renderer.setStyle(this.createIdentityElement.nativeElement,"display", "block")
        this.renderer.setStyle(this.createIdentityElement.nativeElement,"position", "relative")
        this.elements.push(`${this.createIdentityElement}`)
        this.attachForms.push({
          name:"create identity",
          value:"createIdentityElement"
        })
        this.show=true
        break;
      case "contactIdentifiersElement":
        this.renderer.setStyle(this.contactIdentifiersElement.nativeElement,"display", "block")
        this.renderer.setStyle(this.contactIdentifiersElement.nativeElement,"position", "relative")
        this.elements.push(`${this.contactIdentifiersElement}`)
        this.attachForms.push({
          name:"update identifier",
          value:"contactIdentifiersElement"
        })
        this.show=true
        break;
      case "getIdentifiers":
        this.renderer.setStyle(this.getIdentifiersElement.nativeElement,"display", "block")
        this.renderer.setStyle(this.getIdentifiersElement.nativeElement,"position", "relative")
        this.elements.push(`${this.getIdentifiersElement}`)
        this.attachForms.push({
          name:"get identity ID",
          value:"getIdentifiers"
        })
        this.show=true
        break;
      }
  }

  setAttachedVal(val) {
    this.attachedVal = val
  }

  updateDettachedVal(val) {
    this.dettachedVal = val
  }

  updateAttachedVal(val) {
    this.attachVal = val
    this.allowedForms=[]
    this.transmittedInfos=[]
    if(val=="none"){
      this.showAttached=false

      this.error=true
      this.errorMsg="Please choose form before click on attach button"
    }else{
      this.showAttached=true
      switch (val) {
        case "createIdentityElement":
          this.allowedForms.push(
            {
              name:"update identifier",
              value:"contactIdentifiersElement"
            },
            {
              name:"get identity ID",
              value:"getIdentifiers"
            }
          )
          this.transmittedInfos.push("email", "mobile")
          break;
        case "contactIdentifiersElement":
          this.allowedForms.push(
            {
              name:"get identity ID",
              value:"getIdentifiers"
            })
            this.transmittedInfos.push("email")
            break;
        // case "getIdentifiers":
        //   this.attachForms.push({
        //     name:"get identity ID",
        //     value:"getIdentifiers"
        //   })
        //   this.show=true
        //   break;
      }
    }
  }

  updateTransmittedInfo(val){
    this.transmittedInfo=val
  }

  nameChanged(event) {
    this.selectedValue=event
  }

  updatePosition() {
    for (const track of this.attachTrack) {
      this.line[track.index].remove()
      this.line[track.index] = new LeaderLine(track.attach.nativeElement, track.attached.nativeElement, { color: 'black', size: 4, endLabel: `${track.link}` });
    }
  }

  attach() {
    if(this.attachVal==null || this.attachVal==undefined || this.attachedVal==null || this.attachedVal==undefined){
      this.error=true
      this.errorMsg="Please choose form before click on attach button"
    }else if(this.attachVal==this.attachedVal){
      this.error=true
      this.errorMsg="Forms must be different to be attached"
    }else if(this.showAttached==false){
      this.error=true
      this.errorMsg="Please add another form before attach"
    }
    else{
      this.error=false
      this.errorMsg=""
      switch (`${this.attachVal}${this.attachedVal}`) {
        case "createIdentityElementcontactIdentifiersElement":
          this.line[this.attachedNumber]=new LeaderLine(this.createIdentityElement.nativeElement, this.contactIdentifiersElement.nativeElement, {color: 'black', size: 4, endLabel: `${this.attachedNumber}: ${this.transmittedInfo}`});
          this.attachTrack.push({
            index:this.attachedNumber,
            attach:this.createIdentityElement,
            attached:this.contactIdentifiersElement,
            link:`${this.attachedNumber}: ${this.transmittedInfo}`
          })
          this.dettachTracks.push(`${this.attachedNumber}: ${this.transmittedInfo}`)
          this.detachState=true
          this.attachedNumber++
        break;
        case "createIdentityElementgetIdentifiers":
          this.line[this.attachedNumber]=new LeaderLine(this.createIdentityElement.nativeElement, this.getIdentifiersElement.nativeElement, {color: 'black', size: 4, endLabel: `${this.attachedNumber}: ${this.transmittedInfo}`});
          this.attachTrack.push({
            index:this.attachedNumber,
            attach:this.createIdentityElement,
            attached:this.getIdentifiersElement,
            link:`${this.attachedNumber}: ${this.transmittedInfo}`
          })
          this.dettachTracks.push(`${this.attachedNumber}: ${this.transmittedInfo}`)
          this.detachState=true
          this.attachedNumber++
        break;
        case "getIdentifierscontactIdentifiersElement":
          this.line[this.attachedNumber]=new LeaderLine(this.getIdentifiersElement.nativeElement, this.contactIdentifiersElement.nativeElement, {color: 'black', size: 4, endLabel: `${this.attachedNumber}: ${this.transmittedInfo}`});
          this.attachTrack.push({
            index:this.attachedNumber,
            attach:this.getIdentifiersElement,
            attached:this.contactIdentifiersElement,
            link:`${this.attachedNumber}: ${this.transmittedInfo}`
          })
          this.dettachTracks.push(`${this.attachedNumber}: ${this.transmittedInfo}`)
          this.detachState=true
          this.attachedNumber++
        break;
      }
    }
  }

  detach() {
    if (this.dettachedVal!=null ||this.dettachedVal!=undefined ) {
      this.attachTrack=this.attachTrack.filter(elem=>elem.link!=this.dettachedVal)
      const index=this.dettachedVal.split(':')[0]
      this.line[index].remove()
      this.dettachTracks=this.dettachTracks.filter(elem=>elem!=this.dettachedVal)
      if(this.attachTrack.length==0){
        this.detachState=false
      }
    }
  }

  //to be updated later!!!
  run(){
    return new Promise( (resolve, reject)=>{
      this.attachTrack.forEach(follow=>{
        console.log(follow.attached.nativeElement.id)
        switch (follow.attach.nativeElement.id) {
          case this.createIdentityElement.nativeElement.id:
            this.createNewUser(this.createFullIdentity)
            if(!!follow.link){
              switch (follow.attached.nativeElement.id) {
                case this.getIdentifiersElement.nativeElement.id:
                  console.log('bsachref@gmail.com')
                  this.getIdentifier.get("email").patchValue(this.createFullIdentity.get("contactIdentifiers").value[0]["value"])
                  break;
                case this.contactIdentifiersElement.nativeElement.id:
                  this.modifiedContactIdentifier.get("value").patchValue(this.createFullIdentity.get("contactIdentifiers").value[0]["value"])
                  break;
              }
            }
            resolve(true)
            break;
        }
      })
    })
  }

  ngOnDestroy(): void {
    this.createIdentityElementSbs.unsubscribe()
    for (const track of this.attachTrack) {
      this.line[track.index].remove()
    }
  }

}
