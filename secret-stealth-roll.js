main();

async function main() {
    //if no tokens selected, select all character tokens
    let controlledTokens = canvas.tokens.controlled;
    if (!controlledTokens.length) {
        controlledTokens = canvas.scene.tokens.filter(t => t.actor.type === "character");
    }

    //get all selected actors
    const actors = controlledTokens.map(t => t.actor);

    //get modifiers for actors
    const stats = Object.fromEntries(actors.map(actor => [actor.id, actor.skills.stealth.check.mod]))

    //roll for scores
    const rollResults = await Promise.all(
        actors.map(async actor => [actor.name, await (new Roll(`1d20 + ${stats[actor.id]}`)).roll({ async: true })])
    );

    //create message
    const tableRows = rollResults.map(res => `
        <tr>
            <th>${res[0]}</th>
            <th>${res[1].formula}</th>
            <th>${res[1].total}</th>
        </tr>`).join("");
    const table = `
        <table>
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Formula</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>`;

    let message = `<body><h1>Stealth Roll</h1>${table}</body>`;

    //send to chat as gm whisper
    ChatMessage.create({ 
        content: message,
        whisper: ChatMessage.getWhisperRecipients("GM"),
        blind: true,
    });
}