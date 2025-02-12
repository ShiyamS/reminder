import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatInputModule } from '@angular/material/input'


@Component({
  selector: 'app-reminder',
  imports: [MatCardModule, MatProgressBarModule, MatIconModule, MatInputModule, MatFormFieldModule, MatSlideToggleModule, FormsModule],
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.css'
})
export class ReminderComponent implements OnInit {

  glassesConsumed = 0;
  dailyGoal = 18;
  reminderInterval = 1; // minutes
  remindersEnabled = false;

  date = new Date();
  hour = this.date.getHours();

  startHour = 7;
  endHour = 22;
  trackHour = 0;


  private reminderSubscription: any;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    // Load saved data from localStorage
    const savedGlasses = localStorage.getItem('glassesConsumed');
    const saveReminderStatus = localStorage.getItem('reminderStatus');
    const savedTrackHour = localStorage.getItem('trackHour');

    if (savedTrackHour) {
      this.trackHour = parseInt(savedTrackHour, 10);
    }
    if (saveReminderStatus) {
      this.remindersEnabled = JSON.parse(saveReminderStatus);
      this.startReminders();
    }
    if (savedGlasses) {
      this.glassesConsumed = parseInt(savedGlasses, 10);
    }
    console.log('trackHour', this.trackHour)
  }

  addGlass() {
    this.glassesConsumed++;
    localStorage.setItem('glassesConsumed', this.glassesConsumed.toString());

    if (this.glassesConsumed >= this.dailyGoal) {
      this.snackBar.open('Daily goal achieved! Great job! 🎉', 'Close', {
        duration: 3000
      });
    }
  }

  resetCount() {
    this.glassesConsumed = 0;
    localStorage.setItem('glassesConsumed', '0');
  }

  updateReminderInterval() {
    if (this.remindersEnabled) {
      this.toggleReminders();
      this.toggleReminders();
    }
  }

  toggleReminders() {
    console.log(this.remindersEnabled);
    if (this.remindersEnabled) {
      this.startReminders();
    } else {
      this.stopReminders();
    }
  }



  trackHours() {
    console.log('trackHour', this.trackHour)
    if (!this.trackHour) {
      this.trackHour = this.hour;
    }
    if (this.trackHour >= this.startHour && this.trackHour <= this.endHour && this.trackHour != this.hour) {
      console.log('im am here');
      this.trackHour = this.hour;
      this.snackBar.open('Time to drink water! 💧', 'OK', {
      });
    }
    localStorage.setItem('trackHour', this.trackHour.toString());
  }

  private startReminders() {
    if (this.reminderSubscription) {
      this.reminderSubscription.unsubscribe();
    }

    localStorage.setItem('reminderStatus', this.remindersEnabled.toString());
    this.reminderSubscription = interval(this.reminderInterval * 1000)
      .subscribe(() => {
        this.trackHours();
      }

      )
    console.log(this.reminderSubscription)
  }

  private stopReminders() {
    if (this.reminderSubscription) {
      this.reminderSubscription.unsubscribe();
    }
    localStorage.setItem('reminderStatus', this.remindersEnabled.toString());
  }

  ngOnDestroy() {
    this.stopReminders();
  }



}
