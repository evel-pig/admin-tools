import { UpdatePanePayload, updatePane, GoTabPayload
, cancelModal as cancelModalCore, goTab} from '../commonModels/menu';
import { useDispatch } from 'react-redux';

export default function useContainer() {
  const dispatch = useDispatch();
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
    dispatch,
  };
}
