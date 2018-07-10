import { mat2, vec2 } from 'gl-matrix';

/**
 * The hexToCart matrix
 */
export const hexToCartMat = mat2.fromValues(
  1,
  0,
  Math.cos(Math.PI / 3),
  Math.sin(Math.PI / 3)
);
/**
 * The cartToHex matrix
 */
export const cartToHexMat = mat2.create();
mat2.invert(cartToHexMat, hexToCartMat);

/**
 * Transform a vector from hexagonal coordinates to cartesian coordinated
 * @param out The vec2 to output to
 * @param a The vec2 to transform
 */
export function hexToCart(out: vec2, a: vec2) {
  return vec2.transformMat2(out, a, hexToCartMat);
}
/**
 * Transform a vector from cartesian coordinates to hexagonal coordinated
 * @param out The vec2 to output to
 * @param a The vec2 to transform
 */
export function cartToHex(out: vec2, a: vec2) {
  return vec2.transformMat2(out, a, cartToHexMat);
}
