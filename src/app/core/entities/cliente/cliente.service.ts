import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import { ClienteDto } from './cliente-dto';
import { EntityService } from '../entity-service';
import { environment } from 'src/environments/environment';


@Injectable()
export class ClienteService extends EntityService<ClienteDto> {

    constructor(protected http: HttpClient, protected messageService: MessageService) {
        super(
            http,
            messageService,
            `${environment.BASE_URL}/rest/furb/basico/entities/cliente`
        );
    }
}
