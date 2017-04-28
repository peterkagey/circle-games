#encoding: UTF-8
xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title @title
    xml.author @author_name
    xml.description @description
    xml.link request.original_url
    xml.language "en"

    @oeis_sequences.each do |seq|
      xml.item do
        xml.title "A#{seq["number"]}: #{seq["name"]}"
        xml.description seq["data"]
        xml.author seq["author"]
        xml.link "http://oeis.org/A#{seq["number"]}"
      end
    end
  end
end
