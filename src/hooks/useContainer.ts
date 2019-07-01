import { UpdatePanePayload, updatePane, GoTabPayload
, cancelModal as cancelModalCore, goTab} from '../commonModels/menu';

export default function useContainer() {
  /**
   * 跳转子页面
   */
  const push = (payload: UpdatePanePayload, options) => {
    updatePane(payload, options);
  };

  /**
   * 跨tab跳转
   */
  const go = (options: GoTabPayload) => {
    goTab((options));
  };

  /**
   * 关闭modal子页面
   */
  const cancelModal = () => {
    cancelModalCore();
  };

  return {
    push,
    go,
    cancelModal,
  };
}
