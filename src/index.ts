import { copyFile, mkdir, readdir, writeFile } from 'fs/promises'
import { copy } from 'fs-extra'
import { createWriteStream, rmSync } from 'fs';
import archiver from 'archiver';

const cwd = process.cwd();

type NamePredicate = {
    name: string;
}

type ItemEntry = {
    model: string;
    predicate: NamePredicate;
}

type ItemOverride = {
    overrides: ItemEntry[];
}

type TextureEntry = {
    predicate: NamePredicate;
    texture: string;
}

type TextureOverride = {
    overrides: TextureEntry[];
}

type Textures = {
    layer0? : string;
}

type ItemModel = {
    parent: string,
    textures: Textures,
}

const formatItemName = (name : string) => {
    return name.split("_")
        .map(s =>  s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ")
}

const zipDirectory = async (sourceDir: string, outPath: string) => {
    const archive = archiver('zip', { zlib: { level: 9 }})
    const stream = createWriteStream(outPath)

    await new Promise((resolve, reject) => {
        archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream)
    
        stream.on('close', () => resolve(true));
        archive.finalize();    
    })
}

const getFiles = async () => {
    const dirs : string[] = ["resources"];
    const files : string[] = [];

    for(const dir of dirs) {
        const dirents = await readdir(dir, { withFileTypes: true })

        dirs.push(...dirents.filter(dirent => dirent.isDirectory())
            .map(dirent => `${dir}/${dirent.name}`));
        
        files.push(...dirents.filter(dirent => dirent.isFile())
            .map(dirent => `${dir}/${dirent.name}`));
    }

    return files.filter(file => file.endsWith('.png')).sort();
}

const initDirs = async () => {
    rmSync(`out`, {recursive: true, force: true})
    
    await copy(`base`, `out`)

    await mkdir(`out/assets/retextures`)
    await mkdir(`out/assets/retextures/textures`)
    await mkdir(`out/assets/retextures/textures/item`)
    await mkdir(`out/assets/retextures/models`)
    await mkdir(`out/assets/retextures/textures/models`)
    await mkdir(`out/assets/retextures/textures/models/armor`)
    await mkdir(`out/assets/minecraft/overrides`)
    await mkdir(`out/assets/minecraft/overrides/item`)
    await mkdir(`out/assets/minecraft/overrides/armor`)
}

const initItemModels = async (items: string[]) => {
    const itemOverrides : Record<string, ItemOverride> = {};

    for(const item of items) {
        const splitItemName = item.split('/')
        splitItemName.pop()
        splitItemName.shift()
        const filename = splitItemName.join('_').replaceAll("'", "")
        const newName = `out/assets/retextures/textures/item/${filename}.png`
        await copyFile(`${item}`, newName);

        const modelFileName = `out/assets/retextures/models/${filename}.json`
        const modelFileObj : ItemModel = {
            parent: "minecraft:item/generated",
            textures: {
                layer0: `retextures:item/${filename}`
            }
        }
        const modelFileContents = JSON.stringify(modelFileObj, null, 2);
        await writeFile(modelFileName, modelFileContents);

        const itemType = `${splitItemName[0]}_${splitItemName[1]}`

        if(!Object.keys(itemOverrides).includes(itemType)) itemOverrides[itemType] = {
            overrides: []
        }

        itemOverrides[itemType].overrides.push({
            model: `retextures:${filename}`,
            predicate: {
                name: `/(?i).*${formatItemName(splitItemName[2])}.*/`
            },
        })
    }
    
    for(const overrideKey in itemOverrides) {
        const filename = `out/assets/minecraft/overrides/item/${overrideKey}.json`
        const fileContents = JSON.stringify(itemOverrides[overrideKey], null, 2)
        await writeFile(filename, fileContents)
    }
}

const initArmorTextures = async (textures: string[]) => {
    const textureOverrides : Record<string, TextureOverride> = {};

    for(const texture of textures) {
        const splitItemName = texture.split('/')
        splitItemName.pop()
        splitItemName.shift()
        const filename = splitItemName.join('_').replaceAll("'", "")
        const newName = `out/assets/retextures/textures/models/armor/${filename}.png`
        await copyFile(`${texture}`, newName);

        const textureLayer = splitItemName.includes("leggings") ? "layer_2" : "layer_1"
        const material = splitItemName[0]
        const textureKey = `${material}_${textureLayer}`.replace('golden', 'gold')

        if(!Object.keys(textureOverrides).includes(textureKey)) textureOverrides[textureKey] = {
            overrides: []
        }

        textureOverrides[textureKey].overrides.push({
            texture: `retextures:textures/models/armor/${filename}`,
            predicate: {
                name: `/(?i).*${formatItemName(splitItemName[2])}.*/`
            },
        })
    }

    for(const overrideKey in textureOverrides) {
        const filename = `out/assets/minecraft/overrides/armor/${overrideKey}.json`
        const fileContents = JSON.stringify(textureOverrides[overrideKey], null, 2)
        await writeFile(filename, fileContents)
    }
}

const main = async () => {
    await initDirs()

    const files = await getFiles();
    const items = files.filter(file => file.includes("item.png"));
    await initItemModels(items);
    const textures = files.filter(file => file.includes("texture.png"));
    await initArmorTextures(textures);

    await zipDirectory('out', 'pack.zip')
}

await main();
