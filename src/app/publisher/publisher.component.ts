import { Component, ElementRef, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { OpentokService } from '../opentok.service';
import * as OT from '@opentok/client';
import config from '../../../src/config';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})

export class PublisherComponent implements AfterViewInit {
  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  @Input() session: OT.Session;
  publisher: OT.Publisher;
  publishing: Boolean;

  @Output() sendSession = new EventEmitter();

  constructor(private opentokService: OpentokService) {
    this.publishing = false;
  }

  ngOnInit() {
    this.initializeSession();
  }

  // Handling all of our errors here by alerting them
  handleError(error) {
    if (error) {
      alert(error.message);
    }
  }

  initializeSession() {
    this.session = OT.initSession(config.API_KEY, config.SESSION_ID);
    // Subscribe to a newly created stream

    // Create a publisher
    this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {
      insertMode: 'append',
      width: '500px',
      height: '500px'
    });

    this.sendSession.emit(this.session);

    // Connect to the session
    this.session.connect(config.TOKEN, (error) => {
      // If the connection is successful, publish to the session
      if (error) {
        this.handleError(error);
      } else {
        this.session.publish(this.publisher, this.handleError);
      }
    });

    // if (this.session) {
    //   if (this.session['isConnected']()) {
    //     this.publish();
    //   }
    //   this.session.on('sessionConnected', () => this.publish());
    // }
  }

  ngAfterViewInit() {
    if (this.session) {
      if (this.session['isConnected']()) {
        this.publish();
      }
      this.session.on('sessionConnected', () => this.publish());
    }
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }

  connect() {
    this.initializeSession();
  }

  disconnect() {
    if (this.session) {
      this.session.disconnect();
    }
  }

}
