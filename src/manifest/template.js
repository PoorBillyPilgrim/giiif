class Template {
    constructor(id, type) {
        if (type === 'Presentation' || type === 'Manifest') this["@context"] = "http://iiif.io/api/presentation/3/context.json"
        this.id = id;
        this.type = type;
    }

    addItems(items) {
        if (!this.hasOwnProperty("items")) {
            this.items = [];
            this.items.push(items);
        } else {
            console.error("items property already exists. You can only add one item at this time.")
        }
    }
}

export default Template;