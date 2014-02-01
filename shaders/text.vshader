attribute vec2 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

uniform mat4 uWorld;
uniform mat4 uView;
uniform mat4 uProjection;
uniform vec2 uScreenOffset;
uniform vec2 uScreenSize;

void main() {
	vec4 worldPos = uWorld * vec4(0.0, 0.0, 0.0, 1.0);
	mat4 vp = uProjection * uView;
	
	vec4 pos = vp * worldPos;
	pos.xyz /= pos.w;
	pos.w = 1.0;
	pos.xy *= 0.5 * uScreenSize;
	pos.xy += aPosition + uScreenOffset;
	pos.xy = floor(pos.xy);
	pos.xy *= vec2(2, 2) / uScreenSize;
	//pos.xy += 2.0 * (aPosition + uScreenOffset) / uScreenSize;
	gl_Position = pos;
	
	vTexCoord = aTexCoord;
}