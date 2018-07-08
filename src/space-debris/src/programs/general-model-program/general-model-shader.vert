/**
 * A vertex shader for the main models.
 */

attribute lowp vec3 aVertexNormal;
attribute mediump vec3 aVertexPosition;
attribute lowp vec2 aTextureCoord;

uniform lowp mat4 uNormalMatrix;
uniform mediump mat4 uMVMatrix;
uniform mediump mat4 uPMatrix;

varying lowp vec2 vTextureCoord;
varying lowp vec3 vLighting;

void main(void)
{
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;

  // Apply a constant lighting effect.
  lowp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
  lowp vec3 directionalLightColor = vec3(0.6, 0.55, 0.5);
  lowp vec3 directionalVector = vec3(0.85, 0.8, 0.75);

  lowp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

  lowp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);
  vLighting = max(vLighting, vec3(1.0, 1.0, 1.0));
}

// TODO: Incorporate this Blinn-Phong shader example.
/*
#version 330

// attributes
layout(location = 0) in vec3	i_position;	// xyz - position
layout(location = 1) in vec3	i_normal;	// xyz - normal
layout(location = 2) in vec2	i_texcoord0;	// xy - texture coords

// matrices
uniform mat4 u_modelMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform mat3 u_normalMat;

// position of light and camera
uniform vec3 u_lightPosition;
uniform vec3 u_cameraPosition;

// data for fragment shader
out vec3 o_normal;
out vec3 o_toLight;
out vec3 o_toCamera;
out vec2	o_texcoords;

///////////////////////////////////////////////////////////////////

void main(void)
{
   // position in world space
   vec4 worldPosition	= u_modelMat * vec4(i_position, 1);

   // normal in world space
   o_normal	= normalize(u_normalMat * i_normal);

   // direction to light
   o_toLight	= normalize(u_lightPosition - worldPosition.xyz);

   // direction to camera
   o_toCamera	= normalize(u_cameraPosition - worldPosition.xyz);

   // texture coordinates to fragment shader
   o_texcoords	= i_texcoord0;

   // screen space coordinates of the vertex
   gl_Position	= u_projMat * u_viewMat * worldPosition;
}
*/

/*
// TODO: My old pianoman shader

#version 330 core

// From the endDraw function
layout(location = 0) in vec3 vertexPositionInWorldSpace;
layout(location = 1) in vec2 vertexTextureCoordinates;
layout(location = 2) in vec3 vertexNormalInWorldSpace;

// To the fragment shader
out vec2 textureCoordinates;
out vec3 positionInWorldSpace;
out vec3 normalInViewSpace;
out vec3 eyeDirectionInViewSpace;
out vec3 light1DirectionInViewSpace;
out vec3 light2DirectionInViewSpace;
out vec3 light3DirectionInViewSpace;

// From the endDraw function
uniform mat4 viewProjection;
uniform mat4 view;
uniform vec3 light1PositionInWorldSpace;
uniform vec3 light2PositionInWorldSpace;
uniform vec3 light3PositionInWorldSpace;

void main()
{
	vec4 positionInWorldSpace4 = vec4(vertexPositionInWorldSpace, 1);

	gl_Position = viewProjection * positionInWorldSpace4;

	positionInWorldSpace = positionInWorldSpace4.xyz;

	vec3 positionInViewSpace = (view * positionInWorldSpace4).xyz;
	eyeDirectionInViewSpace = vec3(0, 0, 0) - positionInViewSpace;

	vec3 light1PositionInViewSpace = (view * vec4(light1PositionInWorldSpace, 1)).xyz;
	vec3 light2PositionInViewSpace = (view * vec4(light2PositionInWorldSpace, 1)).xyz;
	vec3 light3PositionInViewSpace = (view * vec4(light3PositionInWorldSpace, 1)).xyz;
	light1DirectionInViewSpace = light1PositionInViewSpace + eyeDirectionInViewSpace;
	light2DirectionInViewSpace = light2PositionInViewSpace + eyeDirectionInViewSpace;
	light3DirectionInViewSpace = light3PositionInViewSpace + eyeDirectionInViewSpace;

	normalInViewSpace = (view * vec4(vertexNormalInWorldSpace, 0)).xyz;

	textureCoordinates = vertexTextureCoordinates;
}

*/
