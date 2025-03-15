import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Editor, EditorModule } from 'primeng/editor';
import Quill from 'quill';
import { HelperService } from '../../../services/helper/helper.service';

@Component({
  selector: 'app-inline-editor',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule
  ],
  templateUrl: './inline-editor.component.html',
  styleUrl: './inline-editor.component.scss'
})
export class InlineEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('editor') editor: Editor;

  @Input() borderStyle: boolean;
  @Input() fformControlName: string;
  @Input() fformGroup: FormGroup;
  @Input() focusOnLoad: boolean;
  @Input() model: string;
  @Input() placeholder: string;
  @Input() preventLineBreaks: boolean;
  @Input() tabBehavior: 'default' | 'focus';

  @Output() onEnter: EventEmitter<void> = new EventEmitter();

  toolbar: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private helperService: HelperService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initEditor();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initEditorListeners(), 100);
  }

  initEditor(): void {
    //TODO: simplify editor formatting menu
  }

  initEditorListeners(): void {
    const quill: Quill = this.editor?.quill;
    if (!quill) return;

    //focus
    if (this.focusOnLoad) quill.focus();

    //keydown
    quill.root.addEventListener('keydown', e => {
      
      switch (e.key) {

        case 'Enter' :
          if (this.preventLineBreaks) {
            e.preventDefault();
            this.onEnter.emit();
          }
          break;

        case 'Tab' :
          if (this.tabBehavior === 'focus') {
            e.preventDefault();
            this.helperService.focusNextElement();
          }
          break;

      }
    }, { capture: true });
  }

  showToolbar(): void {
    const editorEl: HTMLElement = this.editor.el.nativeElement;
    const toolbarEl: HTMLElement = editorEl.querySelector('.ql-toolbar');
    const selection: Selection = this.document.getSelection();
    const range: Range = selection.rangeCount ? selection.getRangeAt(0) : null;
    const selectionInEl: boolean = editorEl.contains(range?.startContainer) && editorEl.contains(range?.endContainer);

    if (selection.isCollapsed || !selectionInEl) {
      this.toolbar = false;
      this.changeDetector.detectChanges();
      return;
    }

    const rect: DOMRect = range.getBoundingClientRect();
    const x: number = rect.left;
    const y: number = rect.top;

    // TODO: handle editor offset
    // this.renderer.setStyle(toolbarEl, 'left', x + 'px');
    // this.renderer.setStyle(toolbarEl, 'top', y + 'px');

    this.toolbar = true;
    this.changeDetector.detectChanges();

  }

  onSelection(): void {
    this.showToolbar();
  }

  onText(): void {
    this.showToolbar();
  }

}
