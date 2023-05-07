main();

async function main() {
    //if no tokens selected, select all character tokens
    let controlledTokens = canvas.tokens.controlled;
    if (!controlledTokens.length) {
        controlledTokens = canvas.scene.tokens.filter(t => t.actor.type === "character");
    }

    //get all selected actors
    const actors = controlledTokens.map(t => t.actor);

    //get perception modifiers for actors
    const perceptions = Object.fromEntries(actors.map(actor => [actor.id, actor.attributes.perception.totalModifier]))

    //roll for scores
    const rollResults = await Promise.all(
        actors.map(async actor => [actor.name, await (new Roll(`1d20 + ${perceptions[actor.id]}`)).roll({ async: true })])
    );

    //create message
    const tableRows = rollResults.map(res => `
        <tr>
            <th>${res[0]}</th>
            <th>${res[1].formula}</th>
            <th>${res[1].total}</th>
        </tr>`);
    const table = `
        <table>
            <thead>
                <tr>
                    <th>gracz</th>
                    <th>formuła</th>
                    <th>wynik</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>`;

    let message = `<body><h1>Wyniki</h1>${table}</body>`;

    //send to chat as gm whisper
    ChatMessage.create({ 
        content: message,
        whisper: ChatMessage.getWhisperRecipients("GM"),
        blind: true,
    });
}