import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/core/entities/cliente/cliente.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Cliente } from 'src/app/core/entities/cliente/cliente';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {

  clientes: Cliente[];
  cliente: Cliente;
  columns: any[];
  display: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.clienteService.list()
    .pipe(this.listErrorCatch())
    .subscribe(({ contents }) => {
      this.clientes = contents;
    });

    this.columns = this.getGridColumns();

  }

  public onCancel() {
    this.display = false;
  }

  private getGridColumns() {
    const gridcloumns = [
      { field: 'nome', header: 'Nome' },
      { field: 'dataNascimento', header: 'Data de Nascimento' },
      { field: 'creditoHabilitado', header: 'Credito Habilitado' },
      { field: 'cpf', header: 'CPF' },
    ];

    return gridcloumns;
  }

  public onRemove(item: Cliente) {
    this.messageService.add({
      key: 'removeConfirm',
      data: item, sticky: true,
      severity: 'info',
      summary: 'Voce tem certeza?',
      detail: 'Confirme para DELETAR'
    });
  }

  public onAdd() {
    this.router.navigate(['/cliente/create'], { relativeTo: this.route });
  }

  public onQuickAdd() {
    this.cliente = new Cliente;
    this.display = true;
  }

  public onEdit() {
    this.cliente = Cliente.fromDto({
      id: "123",
      nome: "Teste",
      dataNascimento: "06/12/2019",
      creditoHabilitado: "10",
      cpf: "",
      idFoto: ""
    })

    this.display = true;
  }

  public editItem(cliente: Cliente) {
    this.router.navigate([`/cliente/edit/${cliente.id}`], { relativeTo: this.route });
  }

  public onRemoveConfirm(item: any) {
    const { id, nome } = item.data;

    this.clienteService.delete(id).subscribe(() => {
      this.messageService.clear('removeConfirm');
      this.clientes = this.clientes.filter(cliente => cliente.id !== id);
      this.clientes.find((cliente: Cliente) => cliente.id === id);
      this.messageService.add({
        key: 'remove-toast',
        severity: 'success',
        summary: `Sucesso!`,
        detail: `Cliente ${nome} deletado!`
      });
    });
  }

  public onRemoveReject() {
    this.messageService.clear('removeConfirm');
  }

  private listErrorCatch() {
      return catchError((err: any) => {
        if (err) {
          this.messageService.add({
            key: 'remove-toast',
            severity: 'error',
            summary: 'Erro!',
            detail: `Erro ao carregar a lista!`
          });
        }
        return throwError(err);
      });
  }

}
