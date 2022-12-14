import { Popover } from 'react-tiny-popover';
import cn from 'classnames';

import { AiFillCaretDown } from 'react-icons/ai';
import { BsTrashFill } from 'react-icons/bs';
import { useImport } from '../../provider';
import { useState } from 'react';
import { FieldMapping, FIELD_MAPPINGS } from '../../types';

interface ColumnMapperProps {
    title: string;
    shapeFields: FieldMapping[];
    selectedShapeField?: FieldMapping;
    onChange: (key: string) => void;
}

interface ColumnHeaderProps {
    title: string;
}

const ColumnMapperList = ({ title, shapeFields, onChange }: ColumnMapperProps) => {
    const { state } = useImport();

    return (
        <>
            <h3 className="popover-list-title">{title}</h3>
            <ul className="popover-list">
                {shapeFields
                    .filter((field) => !state.mapping[field.key])
                    .map((field) => (
                        <li className="popover-item" key={field.key} onClick={() => onChange(field.key)}>
                            {field.description}
                        </li>
                    ))}
            </ul>
        </>
    );
};

export const ColumnHeader = ({ title }: ColumnHeaderProps) => {
    const { state, dispatch } = useImport();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const shapeFields: FieldMapping[] = Object.values(FIELD_MAPPINGS.item);
    if (state.selectedShape.type === 'product') {
        shapeFields.push(...Object.values(FIELD_MAPPINGS.productVariant));

        shapeFields.push(
            ...state.attributes.map(
                (attr): FieldMapping => ({
                    key: `variantAttribute.${attr}`,
                    description: `Attribute "${attr}"`,
                }),
            ),
        );
    }

    state.selectedShape.components?.map(({ id, name, type }) =>
        shapeFields.push({
            key: `components.${id}`,
            description: name,
            type,
        }),
    );
    state.selectedShape.variantComponents?.map(({ id, name, type }) =>
        shapeFields.push({
            key: `variantComponents.${id}`,
            description: name,
            type,
        }),
    );

    const selectedShapeField = shapeFields.find(({ key }) => state.mapping[key] === title);

    const availableShapeFields = shapeFields.filter(({ key }) => !state.mapping[key]);
    const basicItemFields = availableShapeFields.filter(({ key }) => key.startsWith('item.'));
    const productVariantFields = availableShapeFields.filter(({ key }) => key.startsWith('variant.'));
    const productVariantAttributeFields = availableShapeFields.filter(({ key }) => key.startsWith('variantAttribute.'));
    const itemComponentsFields = availableShapeFields.filter(({ key }) => key.startsWith('components.'));
    const variantComponentFields = availableShapeFields.filter(({ key }) => key.startsWith('variantComponents.'));

    const onChange = (key: string) => {
        const newMapping = {
            ...state.mapping,
            [key]: title,
        };
        if (selectedShapeField?.key) {
            delete newMapping[selectedShapeField.key];
        }

        dispatch.updateMapping(newMapping);
        setIsPopoverOpen(!isPopoverOpen);
    };

    return (
        <>
            <span style={{ flexGrow: 1 }}>{title}</span>
            <Popover
                onClickOutside={() => setIsPopoverOpen(false)}
                isOpen={isPopoverOpen}
                positions={['bottom']}
                content={
                    <div className="popover">
                        {!!basicItemFields.length && (
                            <ColumnMapperList
                                title="Item Details"
                                shapeFields={basicItemFields}
                                selectedShapeField={selectedShapeField}
                                onChange={onChange}
                            />
                        )}
                        {!!productVariantFields.length && (
                            <ColumnMapperList
                                title="Product Variants"
                                shapeFields={productVariantFields}
                                selectedShapeField={selectedShapeField}
                                onChange={onChange}
                            />
                        )}
                        {!!productVariantAttributeFields.length && (
                            <ColumnMapperList
                                title="Product Variant Attributes"
                                shapeFields={productVariantAttributeFields}
                                selectedShapeField={selectedShapeField}
                                onChange={onChange}
                            />
                        )}
                        {!!itemComponentsFields.length && (
                            <ColumnMapperList
                                title="Item Components"
                                shapeFields={itemComponentsFields}
                                selectedShapeField={selectedShapeField}
                                onChange={onChange}
                            />
                        )}
                        {!!variantComponentFields.length && (
                            <ColumnMapperList
                                title="Product Variant Components"
                                shapeFields={variantComponentFields}
                                selectedShapeField={selectedShapeField}
                                onChange={onChange}
                            />
                        )}
                        {selectedShapeField && (
                            <li className="popover-item popover-item-remove" onClick={() => onChange('')}>
                                <span style={{ flexGrow: 1, textAlign: 'left' }}>Clear</span> <BsTrashFill />
                            </li>
                        )}
                    </div>
                }
            >
                <button
                    className={cn('popover-button', selectedShapeField ? 'mapped' : '')}
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                >
                    <span style={{ flexGrow: 1, textAlign: 'left' }}>
                        {selectedShapeField ? selectedShapeField.description : 'Choose Mapping'}
                    </span>{' '}
                    <AiFillCaretDown />
                </button>
            </Popover>
        </>
    );
};
