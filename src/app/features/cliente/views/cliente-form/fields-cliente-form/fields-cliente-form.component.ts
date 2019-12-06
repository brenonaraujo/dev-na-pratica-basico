import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Cliente } from 'src/app/core/entities/cliente/cliente';
import { ClienteService } from 'src/app/core/entities/cliente/cliente.service';
import { MessageService } from 'primeng/api';
import { map, tap, takeUntil, catchError } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Component({
  selector: 'fields-cliente-form',
  templateUrl: './fields-cliente-form.component.html',
  styleUrls: ['./fields-cliente-form.component.scss']
})
export class FieldsClienteFormComponent implements OnInit, OnDestroy {
  public clienteForm: FormGroup;
  private ngUnsubscribe = new Subject();

  private _cliente: Cliente;
  // @Input() cliente: Cliente;
  @Input()
  set cliente(cliente: Cliente) {
    if (!this.clienteForm) {
      this._cliente = cliente;
      return
    }
    this.clienteForm.reset();
    if (cliente && cliente.id) {
      console.log("Editando o cliente", cliente);
      this.clienteForm.patchValue(cliente);
    }
  }

  @Output()
  public onCancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.clienteForm = this.getFormGroup();
    if (this._cliente)
      this.clienteForm.patchValue(this._cliente);
    // if (this.cliente) {
    //   console.log("Editando o cliente", this.cliente);
    //   this.clienteForm.patchValue(this.cliente);
    // } else {
    //   console.log("Cadastrando um cliente novo");
    //   this.clienteForm.patchValue(new Cliente());
    // }
  }

  private getFormGroup() {
    return this.formBuilder.group({
      id: new FormControl(undefined, Validators.compose([])),
      nome: new FormControl(undefined, Validators.compose([Validators.required, Validators.maxLength(10), this.forbiddenNameValidator(/Enzo/i) ])),
      dataNascimento: new FormControl(new Date(), Validators.compose([Validators.required])),
      creditoHabilitado: new FormControl("true", Validators.compose([Validators.required])),
      cpf: new FormControl(undefined, Validators.compose([Validators.required])),
    });
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public onSave() {
    if (!this.clienteForm.valid) {
      return this.validateAllFormFields(this.clienteForm);
    }

    this.getSaveObservable()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((err: any) => {
          console.log(err);
          return throwError(err);
        })
      ).subscribe(() => {
        this.messageService.add({
          key: 'form-toast',
          severity: 'success',
          summary: `Sucesso!`,
          detail: `O cliente foi salvo com sucesso!`
        });
        this.onCancel.emit();
      });
  }

  private getSaveObservable() {
    const { value } = this.clienteForm;
    const clienteDto = Cliente.toDto(value);

    let observable;

    if (!this.clienteForm.get('id').value) {
      observable = this.clienteService.insert(clienteDto);
    } else {
      // TODO - Emitir um evento de que foi salvo com sucesso
      const id = this.clienteForm.get('id').value;
      observable = this.clienteService.update(id, clienteDto);
    }

    return observable;
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };
  }
}
