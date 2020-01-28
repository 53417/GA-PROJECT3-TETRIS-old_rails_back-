class CreateGameroomStates < ActiveRecord::Migration[6.0]
  def change
    create_table :gameroom_states do |t|

      t.timestamps
    end
  end
end
