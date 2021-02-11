import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'modal-component',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() isShown: boolean;
  @Input() title: string;
  @Input() message: string;

  constructor() {
    this.set('Title', 'Message', false);
  }

  set(title: string, message: string, toShow: boolean = false) {
    this.title = title;
    this.message = message;
    this.isShown = toShow;
  }

  toggle() {
    this.isShown = !this.isShown;
  }

}
