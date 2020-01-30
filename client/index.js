import { auth } from "./classes/sync";
import Template from "./template";
import Example from "./example";
import Final from "./final";

if (window.location.hash === "#start") {
  const example = new Example();
  // const final = new Final();
  //const template = new Template();
} else {
  auth();
}
