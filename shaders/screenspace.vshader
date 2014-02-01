attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

uniform mat4 uWorld;
uniform vec2 uScreenSize;

void main() {
	vTexCoord = aTexCoord;
	vec4 pos = uWorld * vec4(aPosition, 1.0);
	pos.xy = vec2(2.0, 2.0) * (pos.xy / uScreenSize - vec2(0.5, 0.5));
	gl_Position = pos;
}