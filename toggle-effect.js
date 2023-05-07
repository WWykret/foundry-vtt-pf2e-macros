main();

async function main()
{
    const effectToAddUUID = "Compendium.pf2e.equipment-effects.2YgXoHvJfrDHucMr" //change this for other effects

    //check if any tokens are controlled
    if (!canvas.tokens.controlled.length) {
        ui.notifications.warn("Proszę wybrać żeton.");
        return;
    }

    const token = canvas.tokens.controlled[0];
    const actor = token?.actor;

    //cehck if there is actor assigned to token
    if (!actor) {
        ui.notifications.warn("Nie znaleziono aktora dla wybranego żetonu.");
        return;
    }

    //get effect data
    const effectItem = await fromUuid(effectToAddUUID);
    const effectName = effectItem.name;

    //get effect active on actor if exists
    const equipedEffect = actor.items.find(i => i.name === effectName && i.type == "effect");

    //toggle effect
    if (equipedEffect) {
        await actor.deleteEmbeddedDocuments("Item", [equipedEffect.id]);
        ui.notifications.info(`Usunięto efekt '${effectName}'`);
    }
    else {
        const newItemData = duplicate(effectItem.data);
        await actor.createEmbeddedDocuments("Item", [newItemData]);
        ui.notifications.info(`Dodano efekt '${effectName}'`);
    }
}