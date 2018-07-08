/**
 * The fragment shader for the main models.
 */

varying lowp vec2 vTextureCoord;
varying lowp vec3 vLighting;

uniform sampler2D uSampler;

void main(void)
{
  lowp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

  gl_FragColor = vec4(texelColor.rgb * vLighting * 0.5, texelColor.a);
}

// TODO: Incorporate this Blinn-Phong shader example.
/*
#version 330

// data from vertex shader
in vec3	o_normal;
in vec3	o_toLight;
in vec3	o_toCamera;
in vec2	o_texcoords;

// texture with diffuese color of the object
layout(location = 0) uniform sampler2D u_diffuseTexture;

// color for framebuffer
out vec4	resultingColor;

/////////////////////////////////////////////////////////

// parameters of the light and possible values
uniform vec3 u_lightAmbientIntensitys; // = vec3(0.6, 0.3, 0);
uniform vec3 u_lightDiffuseIntensitys; // = vec3(1, 0.5, 0);
uniform vec3 u_lightSpecularIntensitys; // = vec3(0, 1, 0);

// parameters of the material and possible values
uniform vec3 u_matAmbientReflectances; // = vec3(1, 1, 1);
uniform vec3 u_matDiffuseReflectances; // = vec3(1, 1, 1);
uniform vec3 u_matSpecularReflectances; // = vec3(1, 1, 1);
uniform float u_matShininess; // = 64;

/////////////////////////////////////////////////////////

// returns intensity of reflected ambient lighting
vec3 ambientLighting()
{
   return u_matAmbientReflectance * u_lightAmbientIntensity;
}

// returns intensity of diffuse reflection
vec3 diffuseLighting(in vec3 N, in vec3 L)
{
   // calculation as for Lambertian reflection
   float diffuseTerm = clamp(dot(N, L), 0, 1) ;
   return u_matDiffuseReflectance * u_lightDiffuseIntensity * diffuseTerm;
}

// returns intensity of specular reflection
vec3 specularLighting(in vec3 N, in vec3 L, in vec3 V)
{
   float specularTerm = 0;

   // calculate specular reflection only if
   // the surface is oriented to the light source
   if(dot(N, L) > 0)
   {
      // half vector
      vec3 H = normalize(L + V);
      specularTerm = pow(dot(N, H), u_matShininess);
   }
   return u_matSpecularReflectance * u_lightSpecularIntensity * specularTerm;
}

void main(void)
{
   // normalize vectors after interpolation
   vec3 L = normalize(o_toLight);
   vec3 V = normalize(o_toCamera);
   vec3 N = normalize(o_normal);

   // get Blinn-Phong reflectance components
   float Iamb = ambientLighting();
   float Idif = diffuseLighting(N, L);
   float Ispe = specularLighting(N, L, V);

   // diffuse color of the object from texture
   vec3 diffuseColor = texture(u_diffuseTexture, o_texcoords).rgb;

   // combination of all components and diffuse color of the object
   resultingColor.xyz = diffuseColor * (Iamb + Idif + Ispe);
   resultingColor.a = 1;
}
*/

/*
// TODO: My old pianoman shader

#version 330 core

// From the vertex shader
in vec2 textureCoordinates;
in vec3 positionInWorldSpace;
in vec3 normalInViewSpace;
in vec3 eyeDirectionInViewSpace;
in vec3 light1DirectionInViewSpace;
in vec3 light2DirectionInViewSpace;
in vec3 light3DirectionInViewSpace;

// To the view port
out vec3 color;

// From the endDraw function
uniform vec3 light1PositionInWorldSpace;
uniform vec3 light2PositionInWorldSpace;
uniform vec3 light3PositionInWorldSpace;
uniform vec3 light1Color;
uniform vec3 light2Color;
uniform vec3 light3Color;
uniform float light1Power;
uniform float light2Power;
uniform float light3Power;
uniform vec3 drawableColor;

void main()
{
	// ---------- Basic Blinn-Phong lighting model ---------- //

	vec3 diffuseColor = drawableColor;
	vec3 ambientColor = vec3(0.1, 0.1, 0.1) * diffuseColor;
	vec3 specularColor = vec3(0.3, 0.3, 0.3);

	float distance1 = length(light1PositionInWorldSpace - positionInWorldSpace);
	float distance2 = length(light2PositionInWorldSpace - positionInWorldSpace);
	float distance3 = length(light3PositionInWorldSpace - positionInWorldSpace);

	vec3 N = normalize(normalInViewSpace);

	vec3 L1 = normalize(light1DirectionInViewSpace);
	vec3 L2 = normalize(light2DirectionInViewSpace);
	vec3 L3 = normalize(light3DirectionInViewSpace);

	// Cosine of the angle between the normal and the light direction,
	// clamped to 0:
	//		Light is at the vertical of the triangle: 1
	//		Light is perpendicular to the triangle: 0
	//		Light is behind the triangle: 0
	float cosTheta1 = clamp(dot(N, L1), 0, 1);
	float cosTheta2 = clamp(dot(N, L2), 0, 1);
	float cosTheta3 = clamp(dot(N, L3), 0, 1);

	vec3 E = normalize(eyeDirectionInViewSpace);

	vec3 R1 = reflect(-L1, N);
	vec3 R2 = reflect(-L2, N);
	vec3 R3 = reflect(-L3, N);

	// Cosine of the angle between the Eye vector and the Reflect vector,
	// clamped to 0:
	//		Looking into the reflection: 1
	//		Looking elsewhere: < 1
	float cosAlpha1 = clamp(dot(E, R1), 0, 1);
	float cosAlpha2 = clamp(dot(E, R2), 0, 1);
	float cosAlpha3 = clamp(dot(E, R3), 0, 1);

	float distance1Squared = distance1 * distance1;
	float distance2Squared = distance2 * distance2;
	float distance3Squared = distance3 * distance3;

	color =
		ambientColor +
		diffuseColor * light1Color * light1Power * cosTheta1 / distance1Squared +
		diffuseColor * light2Color * light2Power * cosTheta2 / distance2Squared +
		diffuseColor * light3Color * light3Power * cosTheta3 / distance3Squared +
		specularColor * light1Color * light1Power * pow(cosAlpha1, 5) / distance1Squared +
		specularColor * light2Color * light2Power * pow(cosAlpha2, 5) / distance2Squared +
		specularColor * light3Color * light3Power * pow(cosAlpha3, 5) / distance3Squared;
}

*/