import {ThreadList} from './list';
import {TextEditor} from '../channel-editor/box';

export const ThreadPanel = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 px-60 pt-0">
      <div className="flex flex-1">
        <ThreadList />
      </div>
      <TextEditor />
    </div>
  );
};
