import axios from "axios";
import { mailboxlayerApi } from "../config";

export const verifyEmail = async (email: string) => {
  try {
    const request = await axios.get(
      `http://apilayer.net/api/check?access_key=${mailboxlayerApi}&email=${email}&smtp=1&format=1`
    );
    const parsedData = JSON.parse(request.data);
    console.log(parsedData);
    if (request.status == 200) {
      return parsedData["smtp_check"];
    }
  } catch (e) {
    console.error("Error:", e);
  }

  return false;
};
