main();

async function main()
{
    const effectToAddUUID = "Compendium.pf2e.equipment-effects.2YgXoHvJfrDHucMr" //change this for other effects
    if (!canvas.tokens.controlled.length) {
        ui.notifications.warn("Proszę wybrać żeton.");
        return;
    }

    const token = canvas.tokens.controlled[0];
    const actor = token?.actor;

    if (!actor) {
        ui.notifications.warn("Nie znaleziono aktora dla wybranego żetonu.");
        return;
    }

    const effectItem = await fromUuid(effectToAddUUID);

    const effectName = effectItem.name;

    const equipedEffect = actor.items.find(i => i.name === effectName && i.type == "effect");

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