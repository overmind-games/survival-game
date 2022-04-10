import _ from 'underscore';

export default class ResourceObject {

    constructor({id, gid, name, type, x, y, width, height, properties}) {
        this.id = id;
        this.gid = gid;
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.properties = _.object(_.map(properties, prop => [prop.name, prop.value]))
    }
}