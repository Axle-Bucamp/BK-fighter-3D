import { BurgerKingClassic } from '../components/BurgerKingClassic';
import { BurgerKingWhopper } from '../components/BurgerKingWhopper';
import { BurgerKingChicken } from '../components/BurgerKingChicken';
import { VanDammeKickboxer } from '../components/VanDammeKickboxer';
import { VanDammeUniversalSoldier } from '../components/VanDammeUniversalSoldier';
import { VanDammeTimecop } from '../components/VanDammeTimecop';
import { Electra } from '../components/Electra';
import { Terra } from '../components/Terra';
import { Zephyr } from '../components/Zephyr';

const characters = [
  { id: 'bk_classic', name: 'Classic Burger King', component: BurgerKingClassic },
  { id: 'bk_whopper', name: 'Whopper King', component: BurgerKingWhopper },
  { id: 'bk_chicken', name: 'Chicken Royale', component: BurgerKingChicken },
  { id: 'vd_kickboxer', name: 'JCVD Kickboxer', component: VanDammeKickboxer },
  { id: 'vd_universal', name: 'Universal Soldier', component: VanDammeUniversalSoldier },
  { id: 'vd_timecop', name: 'Timecop', component: VanDammeTimecop },
  { id: 'electra', name: 'Electra', component: Electra },
  { id: 'terra', name: 'Terra', component: Terra },
  { id: 'zephyr', name: 'Zephyr', component: Zephyr },
];

export default characters;