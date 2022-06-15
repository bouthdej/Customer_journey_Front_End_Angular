import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/Services/data.service';

import 'leader-line';
import { Router } from '@angular/router';

declare let LeaderLine: any;

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, AfterViewInit {

  subscription: Subscription;
  line=[]
  results=[]
  
  constructor(
    private renderer:Renderer2,
    private dataSvc:DataService,
    private router:Router
    ) { 
    }
  
  ngOnInit() {
    setTimeout(() => {
      this.dataSvc.currentResult.subscribe(result=>{
        console.log('result component')
        console.log(result)
        if(result.length==0){
          this.router.navigate(["/"])
        }else{
          this.results=result
        }
      })
    }, 1000);
  }
  @ViewChild("div1", { static: false }) div1: ElementRef
  @ViewChild("div2", { static: false }) div2: ElementRef
  @ViewChild("div3", { static: false }) div3: ElementRef
  @ViewChild("div4", { static: false }) div4: ElementRef
  @ViewChild("div5", { static: false }) div5: ElementRef

  ngAfterViewInit(): void {
    switch (this.results.length) {
      case 1:
        this.renderer.setStyle(this.div1.nativeElement,"display", "block")
      break;
      case 2:
        this.renderer.setStyle(this.div1.nativeElement,"display", "block")
        this.renderer.setStyle(this.div2.nativeElement,"display", "block")
        this.line[0] = new LeaderLine(this.div1.nativeElement, this.div2.nativeElement, {color: 'black', size: 4}) ;
      break;
      case 3:
        this.renderer.setStyle(this.div1.nativeElement,"display", "block")
        this.renderer.setStyle(this.div2.nativeElement,"display", "block")
        this.renderer.setStyle(this.div3.nativeElement,"display", "block")
        this.line[0] = new LeaderLine(this.div1.nativeElement, this.div2.nativeElement, {color: 'black', size: 4}) ;
        this.line[1] = new LeaderLine(this.div2.nativeElement, this.div3.nativeElement, {color: 'black', size: 4}) ;
      break;
      case 4:
        this.renderer.setStyle(this.div1.nativeElement,"display", "block")
        this.renderer.setStyle(this.div2.nativeElement,"display", "block")
        this.renderer.setStyle(this.div3.nativeElement,"display", "block")
        this.renderer.setStyle(this.div4.nativeElement,"display", "block")
        this.line[0] = new LeaderLine(this.div1.nativeElement, this.div2.nativeElement, {color: 'black', size: 4}) ;
        this.line[1] = new LeaderLine(this.div2.nativeElement, this.div3.nativeElement, {color: 'black', size: 4}) ;
        this.line[2] = new LeaderLine(this.div3.nativeElement, this.div4.nativeElement, {color: 'black', size: 4}) ;
      break;
      case 5:
        this.renderer.setStyle(this.div1.nativeElement,"display", "block")
        this.renderer.setStyle(this.div2.nativeElement,"display", "block")
        this.renderer.setStyle(this.div3.nativeElement,"display", "block")
        this.renderer.setStyle(this.div4.nativeElement,"display", "block")
        this.renderer.setStyle(this.div5.nativeElement,"display", "block")
        this.line[0] = new LeaderLine(this.div1.nativeElement, this.div2.nativeElement, {color: 'black', size: 4}) ;
        this.line[1] = new LeaderLine(this.div2.nativeElement, this.div3.nativeElement, {color: 'black', size: 4}) ;
        this.line[2] = new LeaderLine(this.div3.nativeElement, this.div4.nativeElement, {color: 'black', size: 4}) ;
        this.line[3] = new LeaderLine(this.div4.nativeElement, this.div5.nativeElement, {color: 'black', size: 4}) ;
        this.line[3] = new LeaderLine(this.div4.nativeElement, this.div5.nativeElement, {color: 'black', size: 4}) ;
      break;
    }
  }

  updatePosition() {
    switch (this.results.length) {
      case 1:
        this.renderer.setStyle(this.div1.nativeElement,"display", "block")
      break;
      case 2:
        this.line[0].remove()
        this.line[0] = new LeaderLine(this.div1.nativeElement, this.div2.nativeElement, {color: 'black', size: 4}) ;
      break;
      case 3:
        this.line[0].remove()
        this.line[1].remove()
        this.line[0] = new LeaderLine(this.div1.nativeElement, this.div2.nativeElement, {color: 'black', size: 4}) ;
        this.line[1] = new LeaderLine(this.div2.nativeElement, this.div3.nativeElement, {color: 'black', size: 4}) ;
      break;
      case 4:
        this.line[0].remove()
        this.line[1].remove()
        this.line[2].remove()
        this.line[0] = new LeaderLine(this.div1.nativeElement, this.div2.nativeElement, {color: 'black', size: 4}) ;
        this.line[1] = new LeaderLine(this.div2.nativeElement, this.div3.nativeElement, {color: 'black', size: 4}) ;
        this.line[2] = new LeaderLine(this.div3.nativeElement, this.div4.nativeElement, {color: 'black', size: 4}) ;
      break;
      case 5:
        this.line[0].remove()
        this.line[1].remove()
        this.line[2].remove()
        this.line[3].remove()
        this.line[0] = new LeaderLine(this.div1.nativeElement, this.div2.nativeElement, {color: 'black', size: 4}) ;
        this.line[1] = new LeaderLine(this.div2.nativeElement, this.div3.nativeElement, {color: 'black', size: 4}) ;
        this.line[2] = new LeaderLine(this.div3.nativeElement, this.div4.nativeElement, {color: 'black', size: 4}) ;
        this.line[3] = new LeaderLine(this.div4.nativeElement, this.div5.nativeElement, {color: 'black', size: 4}) ;
        this.line[4] = new LeaderLine(this.div4.nativeElement, this.div5.nativeElement, {color: 'black', size: 4}) ;
      break;
    }
  }

}
