import React from 'react';
import { Category, Component, Variant, Palette } from '@react-buddy/ide-toolbox';
import MUIPalette from '@react-buddy/palette-mui';
import UserAvatar from '../main/components/UserAvatar';

function PaletteTree() {
  return (
    <Palette>
      <Category name="Navigation">
        <Component name="UserAvatar">
          <Variant>
            <UserAvatar name="Bilbo Baggins" />
          </Variant>
        </Component>
      </Category>
      <MUIPalette />
    </Palette>
  );
}
export default PaletteTree;
