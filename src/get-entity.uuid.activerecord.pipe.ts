import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { BaseEntity } from 'typeorm';
import { isUUID } from '@nestjs/common/utils/is-uuid';

@Injectable()
export default class GetEntity implements PipeTransform {
  private readonly relations;

  constructor(
    private readonly entity: typeof BaseEntity,
    relations?: string[] | string,
    private readonly field = 'uuid',
  ) {
    this.relations = typeof relations === 'string' ? [relations] : relations;
  }

  async transform(value: any) {
    if (!value || value === '' || value === 'undefined') {
      throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](
        `No entity ${this.field} provided`,
      );
    }

    if (!isUUID(value)) {
      throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](
        `Error ${this.field} is not a valid UUID`,
      );
    }

    const entity = await this.entity.findOne({
      where: { [this.field]: value },
      relations: this.relations,
    });

    if (!entity) {
      const entity = `${this.entity.toString()}`
        .match(/\w+/g)[1]
        .replace('Entity', '');

      throw new HttpErrorByCode[HttpStatus.NOT_FOUND](
        `Validation failed for ${entity} value`,
      );
    }

    return entity;
  }
}
