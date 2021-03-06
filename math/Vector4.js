module.exports = (function() {
	'use strict';

	function Vector4(x, y, z, w) {
		if (!(this instanceof Vector4)) {
			return new Vector4(x, y, z, w);
		}

		if (typeof x === "object") {
			this.x = x.x||0;
			this.y = x.y||0;
			this.z = x.z||0;
			this.w = x.w||0;
		} else {
			this.x = x||0;
			this.y = y||0;
			this.z = z||0;
			this.w = w||0;
		}
	}

	//shorthand it for better minification
	var vec4 = Vector4.prototype;

	vec4.clone = function() {
		return new Vector4(this.x, this.y, this.z, this.w);
	};

    vec4.copy = function(otherVec) {
        this.x = otherVec.x||0;
        this.y = otherVec.y||0;
        this.z = otherVec.z||0;
        this.w = otherVec.w||0;
        return this;
    };

    vec4.set = function(x, y, z, w) {
        if (typeof x === "object") {
            this.x = x.x||0;
            this.y = x.y||0;
            this.z = x.z||0;
            this.w = x.w||0;
        } else {
            this.x = x||0;
            this.y = y||0;
            this.z = z||0;
            this.w = w||0;

        }
        return this;
    };

    vec4.add = function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    };

    vec4.subtract = function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    };

    vec4.scale = function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    };

	vec4.length = function() {
        var x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;
        return Math.sqrt(x*x + y*y + z*z + w*w);
    };

    vec4.lengthSq = function() {
        var x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;
        return x*x + y*y + z*z + w*w;
    };

    vec4.normalize = function() {
        var x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;
        var len = x*x + y*y + z*z + w*w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this.x = x*len;
            this.y = y*len;
            this.z = z*len;
            this.w = w*len;
        }
        return this;
    };

    vec4.dot = function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    };

    vec4.lerp = function(v, t) {
        var ax = this.x,
            ay = this.y,
            az = this.z,
            aw = this.w;
        t = t||0;
        this.x = ax + t * (v.x - ax);
        this.y = ay + t * (v.y - ay);
        this.z = az + t * (v.z - az);
        this.w = aw + t * (v.w - aw);
        return this;
    };

	vec4.multiply = function(v) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		this.w *= v.w;
		return this;
	};

	vec4.divide = function(v) {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		this.w /= v.w;
		return this;
	};

	vec4.distance = function(v) {
		var dx = v.x - this.x,
			dy = v.y - this.y,
			dz = v.z - this.z,
			dw = v.w - this.w;
		return Math.sqrt(dx*dx + dy*dy + dz*dz + dw*dw);
	};

	vec4.distanceSq = function(v) {
		var dx = v.x - this.x,
			dy = v.y - this.y,
			dz = v.z - this.z,
			dw = v.w - this.w;
		return dx*dx + dy*dy + dz*dz + dw*dw;
	};

	vec4.negate = function() {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
		this.w = -this.w;
		return this;
	};

	vec4.transformMat4 = function(mat) {
		var m = mat.val, x = this.x, y = this.y, z = this.z, w = this.w;
		this.x = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
		this.y = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
		this.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
		this.w = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
		return this;
	};

	//// TODO: is this really the same as Vector3 ??
	///  Also, what about this:
	///  http://molecularmusings.wordpress.com/2013/05/24/a-faster-quaternion-vector-multiplication/
	vec4.transformQuat = function(q) {
		// benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
		var x = this.x, y = this.y, z = this.z,
			qx = q.x, qy = q.y, qz = q.z, qw = q.w,

			// calculate quat * vec
			ix = qw * x + qy * z - qz * y,
			iy = qw * y + qz * x - qx * z,
			iz = qw * z + qx * y - qy * x,
			iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat
		this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
		return out;
	};

	vec4.random = function(scale) {
		scale = scale || 1.0;

		//Not spherical; should fix this for more uniform distribution
		this.x = (Math.random() * 2 - 1) * scale;
		this.y = (Math.random() * 2 - 1) * scale;
		this.z = (Math.random() * 2 - 1) * scale;
		this.w = (Math.random() * 2 - 1) * scale;
		return this;
	};

	vec4.reset = function() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.w = 0;
		return this;
	};

	vec4.sub = vec4.subtract;

	vec4.mul = vec4.multiply;

	vec4.div = vec4.divide;

	vec4.dist = vec4.distance;

	vec4.distSq = vec4.distanceSq;

	vec4.len = vec4.length;

	vec4.lenSq = vec4.lengthSq;

	vec4.toString = function() {
		return 'Vector4(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ')';
	};

	vec4.str = vec4.toString;

	return Vector4;
}) ();