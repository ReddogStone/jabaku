attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aWorldPos;
attribute vec2 aSize;
attribute vec4 aColor;
attribute float aAtlasIndex;

varying vec2 vTexCoord;
varying vec4 vColor;

uniform mat4 uView;
uniform mat4 uProjection;
uniform vec2 uScreenSize;
uniform vec2 uTextureAtlasSize;

void main() {
	vec2 tileSize = vec2(1.0, 1.0) / uTextureAtlasSize.xy;
	float cols = uTextureAtlasSize.x;
	float yCoord = floor(aAtlasIndex / cols);
	vec2 tileCoords = vec2(aAtlasIndex - cols * yCoord, yCoord);
	vTexCoord = aTexCoord + tileCoords * tileSize;
	vColor = aColor;
	
	vec3 worldPos = aWorldPos;
	vec2 size = aSize;
	
	vec4 clipPos = uProjection * uView * vec4(aWorldPos, 1.0);
	vec2 clipSize = vec2(2.0, 2.0) * aSize / uScreenSize;
	gl_Position = vec4(clipPos.xy / clipPos.w + aPosition.xy * clipSize, clipPos.z / clipPos.w, 1.0);
}