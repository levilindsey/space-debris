/**
 * This module defines the configuration for a WebGL program that processes an image in order to
 * render bloom for the bright areas.
 */

import {
  getViewportHeight,
  getViewportWidth,
  MODELS_FRAMEBUFFER_ID,
  programWrapperStore,
} from 'gamex';

import {blendProgramWrapperConfig}  from './blend-program/blend-program-config';
import {blurHorizontalProgramWrapperConfig}  from './blur-horizontal-program/blur-horizontal-program-config';
import {blurVerticalProgramWrapperConfig}  from './blur-vertical-program/blur-vertical-program-config';
import {brightnessProgramWrapperConfig}  from './brightness-filter-program/brightness-filter-program-config';

const _BLOOM_FRAMEBUFFER_1_ID = 'bloom-framebuffer-1';
const _BLOOM_FRAMEBUFFER_2_ID = 'bloom-framebuffer-2';

const bloomProgramWrapperConfig = {};

bloomProgramWrapperConfig.id = 'bloom-program';

bloomProgramWrapperConfig.renderPriority = 1;

bloomProgramWrapperConfig.isAPostProcessor = true;

bloomProgramWrapperConfig.childrenProgramConfigs = [
  brightnessProgramWrapperConfig,
  blurHorizontalProgramWrapperConfig,
  blurVerticalProgramWrapperConfig,
  blendProgramWrapperConfig,
];

bloomProgramWrapperConfig.childrenProgramsToDraw = [
  {
    programId: brightnessProgramWrapperConfig.id,
    inputFramebufferIds: [MODELS_FRAMEBUFFER_ID],
    outputFramebufferId: _BLOOM_FRAMEBUFFER_1_ID,
  },
  {
    programId: blurHorizontalProgramWrapperConfig.id,
    inputFramebufferIds: [_BLOOM_FRAMEBUFFER_1_ID],
    outputFramebufferId: _BLOOM_FRAMEBUFFER_2_ID,
  },
  {
    programId: blurVerticalProgramWrapperConfig.id,
    inputFramebufferIds: [_BLOOM_FRAMEBUFFER_2_ID],
    outputFramebufferId: _BLOOM_FRAMEBUFFER_1_ID,
  },
  {
    programId: blurHorizontalProgramWrapperConfig.id,
    inputFramebufferIds: [_BLOOM_FRAMEBUFFER_1_ID],
    outputFramebufferId: _BLOOM_FRAMEBUFFER_2_ID,
  },
  {
    programId: blurVerticalProgramWrapperConfig.id,
    inputFramebufferIds: [_BLOOM_FRAMEBUFFER_2_ID],
    outputFramebufferId: _BLOOM_FRAMEBUFFER_1_ID,
  },
  {
    programId: blurHorizontalProgramWrapperConfig.id,
    inputFramebufferIds: [_BLOOM_FRAMEBUFFER_1_ID],
    outputFramebufferId: _BLOOM_FRAMEBUFFER_2_ID,
  },
  {
    programId: blurVerticalProgramWrapperConfig.id,
    inputFramebufferIds: [_BLOOM_FRAMEBUFFER_2_ID],
    outputFramebufferId: _BLOOM_FRAMEBUFFER_1_ID,
  },
  {
    programId: blurHorizontalProgramWrapperConfig.id,
    inputFramebufferIds: [_BLOOM_FRAMEBUFFER_1_ID],
    outputFramebufferId: _BLOOM_FRAMEBUFFER_2_ID,
  },
  {
    programId: blurVerticalProgramWrapperConfig.id,
    inputFramebufferIds: [_BLOOM_FRAMEBUFFER_2_ID],
    outputFramebufferId: _BLOOM_FRAMEBUFFER_1_ID,
  },
  {
    programId: blendProgramWrapperConfig.id,
    inputFramebufferIds: [MODELS_FRAMEBUFFER_ID, _BLOOM_FRAMEBUFFER_1_ID],
    // TODO: Add support for not rendering the last sub-program directly to the canvas if we ever
    // add a second post-processing program.
    outputFramebufferId: null,
  },
];

// Ping-pong framebuffers.
bloomProgramWrapperConfig.childrenFramebufferIds =
    [_BLOOM_FRAMEBUFFER_1_ID, _BLOOM_FRAMEBUFFER_2_ID];

/** @param {WebGLRenderingContext} gl */
bloomProgramWrapperConfig.webGLStateSetter = gl => {
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
};

export {bloomProgramWrapperConfig};
