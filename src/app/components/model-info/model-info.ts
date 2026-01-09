import { 
  Component, 
  Input, 
  ViewChild,
  TemplateRef 
} from '@angular/core';

@Component({
  selector: 'app-model-info',
  imports: [],
  templateUrl: './model-info.html',
  styleUrl: './model-info.css',
})
export class ModelInfo {
  @Input() info_title: string = '';
  @Input() info_description: string = '';

  @ViewChild('modelInfoPopup', { static: true })
  template!: TemplateRef<any>;
}
