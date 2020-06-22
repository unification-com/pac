const Base = require('merkle-tree').Base;
const crypto = require('crypto');

class MerkleTree extends Base {

    constructor(config) {
        super(config);
        this._root = null;
        this._nodes = {};
    }

    hash_fn(s) {
        const hash = crypto.createHash('sha256')
            .update(s)
            .digest('hex')
        return hash;
    }

    store_node(_arg, cb) {
        var key, obj, obj_s;
        key = _arg.key, obj = _arg.obj, obj_s = _arg.obj_s;
        this._nodes[key] = {
            obj: JSON.parse(obj_s),
            obj_s: obj_s
        };
        return cb(null);
    };

    lookup_node(_arg, cb) {
        var err, key, ret, val;
        key = _arg.key;
        val = this._nodes[key];
        ret = val != null ? val.obj : void 0;
        err = ret != null ? null : new Error('not found');
        return cb(err, ret);
    };

    lookup_root(_arg, cb) {
        var txinfo;
        txinfo = _arg.txinfo;
        return cb(null, this._root);
    };

    commit_root(_arg, cb) {
        var key;
        key = _arg.key;
        this._root = key;
        return cb(null);
    };

    get_root_node() {
        return this._nodes[this._root];
    };
}

module.exports = MerkleTree;
