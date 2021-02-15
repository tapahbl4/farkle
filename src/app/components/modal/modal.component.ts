import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'modal-component',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() isShown: boolean;
  @Input() title: string;
  @Input() message: string;
  @Output() clickPrimary: EventEmitter<any> = new EventEmitter();
  @Output() clickSecondary: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.set('Title', 'Message', false);
  }

  set(title: string, message: string, toShow: boolean = false): ModalComponent {
    this.title = title;
    this.message = message;
    this.isShown = toShow;
    return this;
  }

  toggle(): boolean {
    this.isShown = !this.isShown;
    return this.isShown;
  }
}
