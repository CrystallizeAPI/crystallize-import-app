import { ClientInterface } from '@crystallize/js-api-client';
import { getManyShapesQuery } from '@crystallize/import-export-sdk/shape';
import { Shape } from '@crystallize/schema/shape';
import { Item } from '@crystallize/schema/item';

export default async (
    apiClient: ClientInterface,
): Promise<{
    shapes: Shape[];
    folders: Item[];
}> => {
    if (!apiClient.config.tenantId) {
        throw new Error('tenantId not set');
    }

    const getManyShapes = getManyShapesQuery(
        {
            tenantId: apiClient.config.tenantId,
        },
        {
            includeComponents: true,
        },
    );
    const shapes: Shape[] = await apiClient
        .pimApi(getManyShapes.query, getManyShapes.variables)
        .then((res) => res?.shape?.getMany);
    const folders: Item[] = await Promise.all(
        shapes
            .filter((shape) => shape.type === 'folder')
            .map((shape) => {
                const query = `
                    query GET_ITEMS_FOR_SHAPE($tenantId: ID!, $identifier: String!, $language: String!) {
                        shape {
                            get(identifier: $identifier, tenantId: $tenantId) {
                                items(language: $language) {
                                    id
                                    name
                                    tree {
                                        path
                                    }
                                }
                            }
                        }
                    }`;

                return apiClient
                    .pimApi(query, {
                        tenantId: apiClient.config.tenantId,
                        identifier: shape.identifier,
                        language: 'en',
                    })
                    .then((res) => res?.shape?.get?.items);
            }),
    ).then((res) => res.flat().filter((item) => !!item && item?.tree?.path));

    return {
        shapes,
        folders: [
            {
                name: 'Root',
                tree: {
                    path: '/',
                },
            } as Item,
            ...folders,
        ],
    };
};
