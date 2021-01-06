import materials from '../../assets/materials.json';

export type Material = typeof materials[number];

const idRegistry: Map<number, Material> = new Map();
const nameRegistry: Map<string, Material> = new Map();

materials.forEach(material => {
    idRegistry.set(material.id as unknown as number, material);
    nameRegistry.set(material.name.toLowerCase(), material);
    material.aliases?.forEach(alias => nameRegistry.set(alias.toLowerCase(), material));
});

export function getMaterial(identifier: string | number | ((material: Material) => boolean)): Material | null {
    if (typeof identifier === 'string') {
        return nameRegistry.get(identifier.toLowerCase()) as Material;
    }
    else if (typeof identifier === 'number') {
        return idRegistry.get(identifier) as Material;
    }
    else if (typeof identifier === 'function') {
        return materials.find(identifier) as Material;
    }
    return null;
}