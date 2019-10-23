import { Component, ElementRef, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import * as OT from '@opentok/client';
import config from '../../../src/config';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})

export class SubscriberComponent implements AfterViewInit, OnChanges {
  @ViewChild('subscriberDiv') subscriberDiv: ElementRef;
  @Input() session: OT.Session;
  @Input() stream: OT.Stream;

  constructor() { }

  ngOnChanges() {
    console.log('Session subscriber', this.session);
    console.log('Session stream', this.stream);
  }

  ngAfterViewInit() {
    // const subscriber = this.session.subscribe(this.stream, this.subscriberDiv.nativeElement, {}, (err) => {
    //   if (err) {
    //     alert(err.message);
    //   }
    // });
    // this.session.on('streamCreated', function (event) {
    //   this.session.subscribe(event.stream, 'subscriber', {
    // insertMode: 'append',
    // width: '100%',
    // height: '100%'
    //   });
    // });
  }

  ngOnInit() {
    this.session.subscribe(this.stream, this.subscriberDiv.nativeElement);

    if (this.session) {
      this.session.on('streamCreated', function (event) {
        this.session.subscribe(event.stream, 'subscriber', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        });
      });

      // Replace with your API key and token:
      this.session.connect(config.TOKEN, function (error) {
        if (error) {
          // failed to connect
        }
      });
    }
  }

  disconnect() {
    if (this.session) {
      this.session.disconnect();
    }
    this.subscriberDiv.nativeElement.remove();
  }
}
