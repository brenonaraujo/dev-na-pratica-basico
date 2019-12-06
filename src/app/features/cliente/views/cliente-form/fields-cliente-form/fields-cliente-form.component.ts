import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Cliente } from 'src/app/core/entities/cliente/cliente';
import { ClienteService } from 'src/app/core/entities/cliente/cliente.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'fields-cliente-form',
  templateUrl: './fields-cliente-form.component.html',
  styleUrls: ['./fields-cliente-form.component.scss']
})
export class FieldsClienteFormComponent implements OnInit {
  public clienteForm: FormGroup;
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
  ) {}

  ngOnInit() {
    this.clienteForm = this.getFormGroup();
    this.clienteForm.patchValue(this._cliente || new Cliente);
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
      nome: new FormControl(undefined, Validators.compose([Validators.required])),
      dataNascimento: new FormControl(undefined, Validators.compose([Validators.required])),
      creditoHabilitado: new FormControl(undefined, Validators.compose([Validators.required])),
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

  // public onSave() {
  //   if (!this.clienteForm.valid) {
  //     return this.validateAllFormFields(this.clienteForm);
  //   }

  //   this.getSaveObservable()
  //   .pipe(
  //     catchError((err: any) => {
  //     console.log(err);
  //     return throwError(err);
  //   })
  //   ).subscribe(() => {
  //     this.goBack();
  //     console.log(`Saved`);
  //   });
  // }

  // private getSaveObservable() {
  //   const { value } = this.clienteForm;
  //   const clienteDto = Cliente.toDto(value);

  //   let observable;

  //   if (this.isNew()) {
  //       observable = this.clienteService.insert(clienteDto);
  //       this.messageService.add({
  //         key: 'form-toast',
  //         severity: 'success',
  //         summary: `Sucesso!`,
  //         detail: `O cliente foi inserido com sucesso!`
  //       });
  //   } else {
  //       const id = this.routeParams.id;
  //       observable = this.clienteService.update(id, clienteDto);
  //   }

  //   return observable;
  // }
}
