import { AfterViewInit, Component, ElementRef, Renderer2, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import 'leader-line';
declare let LeaderLine: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit, OnChanges {
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
  @ViewChild('endingElement', { read: ElementRef, static: false }) endingElement: ElementRef;

  ngOnInit() {
  }

  addNewElem() {
    console.log(this.renderer.setStyle(this.startingElement.nativeElement,"display", "block"))
  }

  updatePosition() {
    if(!!this.line){
      this.line.remove()
      this.line = new LeaderLine(this.startingElement.nativeElement, this.endingElement.nativeElement);
    }
  }

  attach(){
    this.line = new LeaderLine(this.startingElement.nativeElement, this.endingElement.nativeElement);
  }

  ngAfterViewInit() {
    // this.line = new LeaderLine(this.startingElement.nativeElement, this.endingElement.nativeElement);
    // console.log(this.parentDiv.nativeElement)
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
