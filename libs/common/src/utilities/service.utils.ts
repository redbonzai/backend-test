import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * Transforms an identifier into a DTO object, validating the result.
 *
 * @template DtoType - The type of the DTO (Data Transfer Object).
 * @template IdentifierType - The type of the key in the DTO which represents the identifier.
 * @param dtoClass - The class (type) of the DTO.
 * @param identifier - The identifier value to be transformed into the DTO.
 * @param identifierFieldName - The field name in the DTO that corresponds to the identifier.
 * @returns A Promise of the DTO object.
 * @throws Error if validation of the DTO fails.
 */
export async function identifierToDTO<
  DtoType extends object,
  IdentifierType extends keyof DtoType,
>(
  dtoClass: new () => DtoType,
  identifier: DtoType[IdentifierType],
  identifierFieldName: IdentifierType,
): Promise<DtoType> {
  // TypeScript needs assurance that the object we're creating is compatible with DtoType
  const dtoInstance: DtoType = plainToInstance(dtoClass, {
    [identifierFieldName]: identifier,
  } as unknown as Partial<DtoType>);

  // Validate the newly created DTO instance.
  const validationErrors = await validate(dtoInstance as object); // Explicitly cast dtoInstance to an object for validate()
  if (validationErrors.length > 0) {
    throw new Error(`Validation error: ${JSON.stringify(validationErrors)}`);
  }

  return dtoInstance;
}

/**
 * High-Order function for multiple DTO transformations.
 * @param transformations
 */
export async function transformMultipleIdentifiersToDtos<
  DtoType extends object,
>(
  transformations: {
    dtoClass: new () => DtoType;
    identifier: any;
    identifierFieldName: keyof DtoType;
  }[],
): Promise<DtoType[]> {
  return Promise.all(
    transformations.map((transformation) =>
      identifierToDTO(
        transformation.dtoClass,
        transformation.identifier,
        transformation.identifierFieldName,
      ),
    ),
  );
}
