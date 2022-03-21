import { AfterViewInit, Component, ElementRef, Renderer2, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import 'leader-line';
declare let LeaderLine: any;

@Component({
  selector: 'app-idaas',
  templateUrl: './idaas.component.html',
  styleUrls: ['./idaas.component.css']
})
export class IdaasComponent implements OnInit, OnChanges  {
  initElem:string="elem1"

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {
 }
 line: any
 draggable: any
 draggable2: any
 @ViewChild("parent", { static: false }) parentDiv: ElementRef
 @ViewChild('startingElement', { read: ElementRef, static: false }) startingElement: ElementRef;
 @ViewChild('creatingidentity', { read: ElementRef, static: false }) creatingidentity: ElementRef;
 @ViewChild('changeprofile', { read: ElementRef, static: false }) changeprofile: ElementRef;
 @ViewChild('changepassword', { read: ElementRef, static: false }) changepassword: ElementRef;
 @ViewChild('endingElement', { read: ElementRef, static: false }) endingElement: ElementRef;

  ngOnInit() {
  }
  CreateIdnetity(){
    console.log(this.renderer.setStyle(this.creatingidentity.nativeElement,"display", "block"))
}
UpdateProfil(){
  console.log(this.renderer.setStyle(this.changeprofile.nativeElement,"display", "block"))
}
ChangePassword(){
  console.log(this.renderer.setStyle(this.changepassword.nativeElement,"display","block"))
}
updatePosition() {
  if(!!this.line){
    this.line.remove()
    this.line = new LeaderLine(this.startingElement.nativeElement, this.endingElement.nativeElement);
  }
}
attach(){
  this.line = new LeaderLine(this.creatingidentity.nativeElement, this.changeprofile.nativeElement);
}
ngOnChanges(changes: SimpleChanges): void {
  if(!!this.line){
    this.line.remove();
  }
}
submitGetIdentifier(data){
  console.log(data)
}
}



