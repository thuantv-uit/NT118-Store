import React from "react";
import { COLORS as c } from "../../theme/colors";

// ==== ACTION ICONS ====
import Back from "../../assets/icons/actions/back.svg";
import Edit from "../../assets/icons/actions/Bot-Edit.svg";
import Trash from "../../assets/icons/actions/Bot-Trash.svg";
import Notification from "../../assets/icons/actions/Icon-Notification.svg";
import Setting from "../../assets/icons/actions/Icon-Setting.svg";
import Logout from "../../assets/icons/actions/Icon-LogOut.svg";
import Help from "../../assets/icons/actions/Icon-Help.svg";
import Search from "../../assets/icons/actions/Bot-Search.svg";

// ==== NAVIGATION ICONS ====
import Home from "../../assets/icons/navigation/Home.svg";
import Cart from "../../assets/icons/navigation/cart.svg";
import Category from "../../assets/icons/navigation/catorgi.svg";
import Profile from "../../assets/icons/navigation/Profile.svg";
import Wishlist from "../../assets/icons/navigation/whistlist.svg";

// ==== UI ICONS ====
import AoKhoac from "../../assets/icons/ui/ao_khoac.svg";
import Vest from "../../assets/icons/ui/vest.svg";
import Vay from "../../assets/icons/ui/vay.svg";
import TuiXach from "../../assets/icons/ui/tui_xach.svg";
import Jean from "../../assets/icons/ui/jean1.png"; // PNG vẫn hỗ trợ
import Filter from "../../assets/icons/ui/filter.svg";
import SettingUi from "../../assets/icons/ui/setting.svg";
import Star from "../../assets/icons/ui/Star.svg";

// ==== MAP ICONS ====
const icons = {
  // actions
  back: Back,
  edit: Edit,
  trash: Trash,
  notification: Notification,
  setting: Setting,
  logout: Logout,
  help: Help,
  search: Search,

  // navigation
  home: Home,
  cart: Cart,
  category: Category,
  profile: Profile,
  wishlist: Wishlist,

  // ui
  ao_khoac: AoKhoac,
  vest: Vest,
  vay: Vay,
  tui_xach: TuiXach,
  jean: Jean,
  filter: Filter,
  setting_ui: SettingUi,
  star: Star,
};

// ==== COMPONENT ====
export function Icon({ name, size = 24, color = c.black, style }) {
  const SvgIcon = icons[name];
  if (!SvgIcon) {
    console.warn(`⚠️ Icon '${name}' không tồn tại trong thư mục assets/icons`);
    return null;
  }

  return <SvgIcon width={size} height={size} fill={color} style={style} />;
}
