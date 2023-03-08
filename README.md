# Wynn Armor Reborn

A reworked version of [AWS404&#39;s WynnArmour](https://github.com/aws404/WynnArmour) resource pack to bring back unique armor textures using the more modern Chime, instead of Optifine. There are *many* missing textures currently, but this repository has been configured to easily contribute new textures by simply placing them in the correct folder, no JSON necessary.

## Dependencies

Minecraft:

* [Fabric](https://fabricmc.net/)
* [Chime](https://www.curseforge.com/minecraft/mc-mods/chime-fabric)

Build Dependencies

* Node.js ^v19

## Where to Download

Navigate to the [releases](https://github.com/SlyCedix/wynn-armour-reborn/releases) page of this repository and install the latest version of the resource pack

## Contributing

**Multiple textures may be included in one pull request as long as they are not replacing existing textures**
**Credits will be included in the release that your textures are added in**

1. [Fork the repository](https://github.com/SlyCedix/wynn-armour-reborn/fork)
2. Clone the repository locally `git clone https://github.com/YOUR_USERNAME/WynnArmorReborn.git`
3. Navigate into the repository folder `cd WynnArmorReborn`
4. Install dependencies `npm i`
5. Create the relevant folder for the piece of armor being replaced:
   * Names should be in all lower case
   * Apostrophes should be included
   * Spaces should be replaced with underscores
   * Ex: Leather Leggings `Adventurer's Pants` would be placed in `resources/leather/leggings/adventurer's_pants`
6. Create the texture for the image that will appear in the inventory in that folder called `item.png`
7. Create the texture for the actual armor that will appear on the player in that folder called `texture.png`
8. Build the resource pack `npm run build:all`
9. Test that the `pack.zip` file contains your change in game
10. Push the changes to your fork
    * `git add .`
    * `git commit -m "DESCRIPTIVE MESSAGE ABOUT YOUR CHANGES"
    * `git push origin main`
11. [Create a pull request](https://github.com/SlyCedix/wynn-armour-reborn/compare)

## Credits

Original textures by:

* AWS404
* SeeksarianZxSery
* ChocolateGelato
* FishCat
