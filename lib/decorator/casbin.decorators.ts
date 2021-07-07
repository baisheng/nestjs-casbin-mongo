import {Inject} from "@nestjs/common";
import {CASBIN_ADAPTER, CASBIN_ENFORCER} from "../casbin.constants";

/**
 * In Service Inject
 */
export const InjectEnforcer = () => Inject(CASBIN_ENFORCER);
export const InjectAdapter = () => Inject(CASBIN_ADAPTER);
