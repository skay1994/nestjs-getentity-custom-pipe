import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { EntityTarget, getRepository } from 'typeorm';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export default class GetEntity implements PipeTransform {
  private readonly relations;

  constructor(
    private readonly entity: EntityTarget<any>,
    relations?: string[] | string,
    private readonly field = 'id',
  ) {
    this.relations = typeof relations === 'string' ? [relations] : relations;
  }

  async transform(value: any) {
    if (!value || value === '' || value === 'undefined' || isNaN(value)) {
      throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](
        `No entity ${this.field} provided`,
      );
    }

    const entity = await getRepository(this.entity).findOne({
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
