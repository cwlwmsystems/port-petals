import {
  permanentRedirect,
} from "next/navigation";

export default function LegacyShirtsPage() {
  permanentRedirect("/apparel");
}
