import BaseScene from "./BaseScene";

export default class StoreScene extends BaseScene {

    constructor() {
        super("StoreScene");
    }

    create() {
        super.create();
        this.cameras.main.fadeIn(700, 0, 0, 0)
    }
}