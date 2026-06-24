import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BusyService } from '../../../core/services/busy.service';

@Component({
  selector: 'app-empty-state',
  imports: [MatIcon, MatButton, RouterLink],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
})
export class EmptyStateComponent {
  busyService = inject(BusyService);
  message = input.required<String>();
  icon = input.required<String>();
  actionText = input.required<String>();
  action = output<void>();

  onAction() {
    this.action.emit();
  }
}
