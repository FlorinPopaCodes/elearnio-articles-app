import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Engagement } from '../../types';

@Component({
  selector: 'app-engagement-panel',
  imports: [RouterLink],
  templateUrl: './engagement-panel.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementPanelComponent {
  stats = input.required<Engagement>();
}
