import { Injectable }               from '@angular/core';
import { JsfNotificationInterface } from '@kalmia/jsf-common-es2015';
import { Subject }                  from 'rxjs';
import { MatSnackBar }              from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class BuilderNotificationService {

  notification$: Subject<JsfNotificationInterface> = new Subject<JsfNotificationInterface>();

  constructor(private snackBar: MatSnackBar) {
  }


  showNotification(notification: JsfNotificationInterface) {
    this.notification$.next(notification);
  }

  showQuickActionNotification(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000
    });
  }

}
